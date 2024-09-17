import React from 'react'

const Logos = () => {
  return (
    <section class="py-10 bg-white sm:py-16 lg:py-10">
    <div class="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">

    <div class="grid items-center grid-cols-2 gap-10 mt-12 md:grid-cols-4 sm:gap-y-16">
            <div>
                <img class="object-contain w-auto mx-auto h-14" src="https://1000logos.net/wp-content/uploads/2017/04/Audi-Logo-2016.png" alt="Audi Logo" />
            </div>

            <div>
                <img class="object-contain w-auto mx-auto h-14" src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.png" alt="Toyota Logo" />
            </div>

            <div>
                <img class="object-contain w-auto h-14 mx-auto" src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW Logo" />
            </div>

            <div>
                <img class="object-contain w-auto mx-auto h-14" src="https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.png" alt="Mercedes-Benz Logo" />
            </div>
        </div>
    </div>
</section>

  )
}

export default Logos