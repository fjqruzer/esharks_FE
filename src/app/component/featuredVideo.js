export default function FeaturedVideo() {
 return (
<div className="flex bg-neutral-950 flex-wrap justify-center shadow">
   
<div className="w-full lg:w-1/2 px-4 mb-4 lg:mb-0 flex justify-center items-center">
  <div className="text-center m-20">
<h2 className="text-3xl font-serif italic mb-2 font-bold">Meet the Graduates</h2>
<p className="text-md">From freshmen to senior, the journey was nothing short of a thrilling adventure full of struggles, comebacks, and victorious wins. Our graduates share the game that best captured their high school and college experiences. Ready to find out their top picks? Watch the full video on Facebook!</p>
<br></br>
<a href="https://www.facebook.com/LSBesports" target="_blank" rel="noopener noreferrer" >
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="shrink-0 size-20 text-white-600 hover:text-blue-600 mx-auto"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
</a>

  </div>
</div>
  <div className="w-full lg:w-1/2 px-4">
    <iframe 
      src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/100083483833074/videos/680465268057879&show_text=0&width=100%"
      width="100%" 
      height="100%" 
      style={{border:"none",overflow:"hidden", aspectRatio: "16/9"}}
      scrolling="no" 
      frameBorder="0" 
      allowFullScreen={true} 
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  </div>
</div>
);
}