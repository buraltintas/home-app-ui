import {ImageResponse} from 'next/og';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

// The shipped banner is 3:1 with the logo pinned left and two thirds of the canvas empty,
// so a share preview cropped it to 1.91:1 and showed mostly blank cream with the mark
// pushed to one side. It read as an unfinished image with something missing on the right.
//
// This renders the full logo -- the mascot with the wordmark, the version people recognise
// -- unmodified and centred at the ratio messaging apps actually crop to, with the line
// under it. The transparent cut is the one used here: the square file carries its own cream
// ground, which sits as a visible block on this canvas. Same artwork, nothing recoloured,
// and the line stays Turkish because it is wordplay on the product's own name.
//
// It lives at a fixed path rather than using the opengraph-image file convention, because
// that convention attaches only where no page sets its own openGraph block -- which most
// of these pages do, to give themselves a real title and description. One explicit URL is
// easier to reason about than an inheritance rule that silently drops the image.
export const revalidate=86400;

export function GET(){
  const logo=readFileSync(join(process.cwd(),'public/brand/brand-logo-transparent.png'));
  return new ImageResponse(
    (
      <div style={{
        width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',
        backgroundColor:'#faf8f4',flexDirection:'column',gap:8,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString('base64')}`} width={430} height={430} alt=""/>
        <div style={{fontSize:56,fontWeight:700,letterSpacing:-1.8,color:'#16140f'}}>Bize Sor.</div>
      </div>
    ),
    {width:1200,height:630},
  );
}
