import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DocumentProcessRequest {
  files: Array<{
    name: string;
    type: string;
    data: string; // base64 encoded
  }>;
  userAddress: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const { files, userAddress }: DocumentProcessRequest = await req.json();

    if (!files || files.length === 0) {
      return new Response('No files provided', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    console.log(`Processing ${files.length} documents for user ${userAddress}`);

    // Generate verification hash based on document contents
    const documentHashes = await Promise.all(
      files.map(async (file) => {
        const data = new TextEncoder().encode(file.data + file.name + file.type);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      })
    );

    // Combine all document hashes to create a single verification hash
    const combinedHash = documentHashes.join('');
    const finalHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(combinedHash));
    const verificationHash = '0x' + Array.from(new Uint8Array(finalHashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Create metadata object
    const metadata = {
      userAddress,
      documentCount: files.length,
      documentTypes: files.map(f => f.type),
      documentNames: files.map(f => f.name),
      verificationTime: new Date().toISOString(),
      verificationMethod: 'document_upload',
      status: 'verified'
    };

    // Generate metadata URI (in a real implementation, this would be stored on IPFS)
    const metadataString = JSON.stringify(metadata);
    const metadataBuffer = new TextEncoder().encode(metadataString);
    const metadataHashBuffer = await crypto.subtle.digest('SHA-256', metadataBuffer);
    const metadataHash = Array.from(new Uint8Array(metadataHashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const metadataURI = `https://metadata.soulbound.identity/${metadataHash}`;

    console.log('Document processing completed', {
      verificationHash,
      metadataURI,
      documentCount: files.length
    });

    return new Response(
      JSON.stringify({
        success: true,
        verificationHash,
        metadataURI,
        metadata,
        processingTime: Date.now()
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );

  } catch (error) {
    console.error('Error processing documents:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});