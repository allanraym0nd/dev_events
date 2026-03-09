import ExploreBtn from '@/components/ExploreButton';
import React from 'react'

const Home = () => {
  return (
    <div>
      <section>
        <h1 className="text-center">The Hub For Every Dev <br /> Event You Can't Miss</h1>
        <p className="text-center mt-5 ">Hackathons, Meetups and Conferences, All in one place</p>
        <ExploreBtn />
      </section>
    </div>
  )
}

export default Home;
