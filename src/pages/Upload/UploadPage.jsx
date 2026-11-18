import React from 'react';
import { Link } from 'react-router-dom';
import PictureUploader from '../uploadImage/PictureUploader';
import BackButton from '../../components/wedding/BackButton';
import { Eyebrow, Ornament, PageFrame } from '../../components/wedding/Decor';
import { smallLink } from '../../components/wedding/styles';
import { WEDDING } from '../Invitation/weddingDetails';
import hero from '../../assets/images/invitation/hero.jpg';

const { groom, bride } = WEDDING;

export default function UploadPage() {
  return (
    <div className="relative min-h-screen bg-cream font-body text-espresso antialiased">
      <PageFrame />
      <div className="absolute left-10 top-10 z-50 sm:left-14 sm:top-14">
        <BackButton />
      </div>

      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 pb-20 pt-24 text-center sm:pt-28">
        <img
          src={hero}
          alt=""
          className="mx-auto h-28 w-28 rounded-full object-cover object-[50%_22%] ring-1 ring-caramel/70 ring-offset-4 ring-offset-cream"
        />
        <Eyebrow className="mt-8 text-bronze">
          {groom.firstName} &amp; {bride.firstName}
        </Eyebrow>
        <h1 className="mt-3 text-balance font-display text-5xl font-medium sm:text-6xl">Share your photos</h1>
        <Ornament className="mt-5 text-caramel" />
        <p className="mx-auto mt-6 max-w-sm text-espresso/75">
          Captured a moment from our celebration? Add it to our gallery so we can relive the day through your eyes.
        </p>

        <div className="mt-10 rounded-sm border border-espresso/10 bg-white/60 p-6 text-left sm:p-8">
          <PictureUploader />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/" className={smallLink}>View the invitation</Link>
          <Link to="/view" className={smallLink}>Couple's gallery</Link>
        </div>
      </main>
    </div>
  );
}
