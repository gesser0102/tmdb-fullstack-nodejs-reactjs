import React from 'react';
import SliderBanner from '../components/common/SliderBanner';
import tmdbConfig from "../api/services/tmdbService";


export const HomePage = () => {
  return (
    <>

      <SliderBanner mediaType={tmdbConfig.mediaType.movie} mediaCategory={tmdbConfig.mediaCategory.popular}/>


    </>
  );
};