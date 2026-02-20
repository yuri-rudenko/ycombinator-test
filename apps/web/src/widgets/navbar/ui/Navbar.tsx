"use client";

import React from 'react'
import LocationSelect from '@/src/shared/ui/LocationSelect'
import {Container} from '@/src/shared/ui/Container'
import {ThemeSwitcher} from '@/src/shared/ui/ThemeSwitcher'

interface INavbarProps {}

const Navbar: React.FC<INavbarProps> = () => {

  return (
    <Container className={'flex items-center p-3 mx-auto'}>
      <div className={'flex gap-2 md:gap-4 items-center w-full'}>
        <div className={'flex gap-2 md:gap-4 items-center justify-start'}>
          <p className={'text-md md:text-lg w-full'}>{"Per Diem"}</p>
          <ThemeSwitcher/>
        </div>
        <LocationSelect/>
      </div>
    </Container>
  );
};

export default Navbar;
