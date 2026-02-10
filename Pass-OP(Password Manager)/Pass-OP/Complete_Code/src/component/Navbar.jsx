import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-transparent p-4'>
        <div className="inside  flex justify-between items-center px-10 py-1 pb-4">

<div className="logo font-bold text-2xl text-[#ffffff]">
  <span className="typewriter inline-block"> &lt;PassOP/&gt; </span>
</div>


      <ul className='flex gap-6 text-white'>
        <li><a href="/">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
        </div>
        <pre className="h-[2px] w-11/12 bg-gradient-to-r from-transparent via-[#261358] to-transparent rounded-full shadow-[0_0_10px_#261358aa]"></pre>
    </nav>
  )
}

export default Navbar
