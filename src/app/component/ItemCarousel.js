export default function ItemCarousel() {
    return (
    <section>
          <div className="max-w-1xl text-center mx-auto mb-10 lg:mb-14">
    <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-black">Get the hottest merch of this school year!</h2>
<p className="mt-1 text-gray-600 dark:text-black-400">Level up your style game with our featured jersey - the perfect blend of fashion and flair.</p>
  </div>
  
  <div className="flex flex-wrap justify-center gap-4">
  <div className="bg-neutral-800 rounded-lg shadow-lg p-4 h-90 w-90">
    <h2 className="text-lg font-bold text-white">Card 1</h2>
    <p className="text-gray-400">This is some text inside the card.</p>
  </div>
    <div className="bg-neutral-800 rounded-lg shadow-lg p-4 h-90 w-90">
    <h2 className="text-lg font-bold text-white">Card 1</h2>
    <p className="text-gray-400">This is some text inside the card.</p>
  </div>
    <div className="bg-neutral-800 rounded-lg shadow-lg p-4 h-90 w-90">
    <h2 className="text-lg font-bold text-white">Card 1</h2>
    <p className="text-gray-400">This is some text inside the card.</p>
  </div>
 
</div>
    </section>

    );
}