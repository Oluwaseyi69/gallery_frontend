import React from 'react';
import { Link } from 'react-router-dom';
import { WEDDING } from './weddingDetails';
import { PHOTOS } from './photos';
import { downloadIcs, formatPhone, googleCalendarUrl, mapsUrl, whatsappUrl } from './links';
import Countdown from './Countdown';
import PhotoCarousel from './PhotoCarousel';
import RsvpForm from './RsvpForm';
import { Eyebrow, Ornament, PageFrame } from '../../components/wedding/Decor';
import { focusRing, outlineButton, primaryButton, smallLink } from '../../components/wedding/styles';
import hero from '../../assets/images/invitation/hero.jpg';

const { groom, bride, venue } = WEDDING;

function SectionHeading({ eyebrow, title, light = false }) {
  return (
    <div className="mb-12 text-center">
      <Eyebrow className={light ? 'text-caramel' : 'text-bronze'}>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-balance font-display text-4xl font-medium sm:text-5xl">{title}</h2>
      <Ornament className="mt-5 text-caramel" />
    </div>
  );
}

function DetailCard({ eyebrow, children }) {
  return (
    <div className="flex flex-col items-center rounded-sm border border-espresso/10 bg-white/60 px-6 py-10 text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      {children}
    </div>
  );
}

export default function Invitation() {
  return (
    <div className="min-h-screen bg-cream font-body text-espresso antialiased">
      <PageFrame />
      {/* Opening */}
      <header className="lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="relative">
          <img
            src={hero}
            alt={`${groom.firstName} and ${bride.firstName} in traditional attire`}
            className="aspect-[4/5] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:object-[50%_25%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream to-transparent lg:hidden" />
        </div>
        <div className="flex items-center justify-center px-6 pb-4 pt-2 lg:px-12 lg:py-16">
          <div className="text-center">
            <Eyebrow>Together with their families</Eyebrow>
            <h1 className="mt-6 font-display font-medium leading-[0.95]">
              <span className="block text-6xl sm:text-7xl xl:text-8xl">{groom.firstName}</span>
              <span className="my-2 block text-4xl italic text-caramel">&amp;</span>
              <span className="block text-6xl sm:text-7xl xl:text-8xl">{bride.firstName}</span>
            </h1>
            <p className="mt-8 text-sm text-espresso/70">request the pleasure of your company at their</p>
            <p className="mt-2 font-display text-2xl italic sm:text-3xl">{WEDDING.eventName}</p>
            <Ornament className="mt-6 text-caramel" />
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em]">
              {WEDDING.weekday}, {WEDDING.dateLabel}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-espresso/70">{venue.city}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href="#rsvp" className={primaryButton}>RSVP</a>
              <a href="#details" className={outlineButton}>The details</a>
            </div>
          </div>
        </div>
      </header>

      {/* A note from the couple */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>A note from us</Eyebrow>
          <div className="mt-8 space-y-6 font-display text-2xl leading-relaxed sm:text-[1.75rem]">
            {WEDDING.message.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Ornament className="mt-12 text-caramel" />
          <p className="mt-8 text-xs font-medium uppercase leading-loose tracking-[0.25em] text-bronze">
            {groom.fullName}
            <span className="block font-display text-2xl normal-case italic tracking-normal text-caramel">&amp;</span>
            {bride.fullName}
          </p>
        </div>
      </section>

      {/* Countdown */}
      <section className="bg-espresso px-6 py-20 text-cream sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="mb-10 text-caramel">Counting down to the day</Eyebrow>
          <Countdown startsAt={WEDDING.startsAt} endsAt={WEDDING.endsAt} />
        </div>
      </section>

      {/* Details */}
      <section id="details" className="scroll-mt-4 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Save the date" title="The celebration" />
          <div className="grid gap-4 md:grid-cols-3">
            <DetailCard eyebrow="When">
              <p className="mt-4 font-display text-4xl">{WEDDING.weekday}</p>
              <p className="mt-1 text-lg">{WEDDING.dateLabel}</p>
              <p className="mt-1 text-espresso/70">{WEDDING.timeLabel}</p>
              <div className="mt-6 flex flex-col items-center gap-2">
                <a href={googleCalendarUrl(WEDDING)} target="_blank" rel="noopener noreferrer" className={smallLink}>
                  Add to Google Calendar
                </a>
                <button type="button" onClick={() => downloadIcs(WEDDING)} className={smallLink}>
                  Add to Apple / Outlook calendar
                </button>
              </div>
            </DetailCard>

            <DetailCard eyebrow="Where">
              <p className="mt-4 font-display text-4xl">{venue.hall}</p>
              <p className="mt-1 text-lg">{venue.building}</p>
              <p className="mt-1 text-espresso/70">{venue.address}</p>
              <a href={mapsUrl(WEDDING)} target="_blank" rel="noopener noreferrer" className={`mt-6 ${outlineButton}`}>
                Get directions
              </a>
            </DetailCard>

            <DetailCard eyebrow="Dress code">
              <span className="mt-5 block h-14 w-14 rounded-full border border-espresso/15 bg-white shadow-inner" aria-hidden="true" />
              <p className="mt-4 font-display text-4xl">{WEDDING.dressCode}</p>
              <p className="mt-1 text-espresso/70">Colour of the day</p>
            </DetailCard>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-sand py-20 sm:py-28">
        <div className="px-6">
          <SectionHeading eyebrow="A few favourites" title="Our moments" />
        </div>
        <PhotoCarousel photos={PHOTOS} />
      </section>

      {/* RSVP */}
      <section id="rsvp" className="scroll-mt-4 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl">
          <SectionHeading eyebrow="Kindly reply" title="Will you join us?" />
          <div className="rounded-sm border border-espresso/10 bg-white/60 p-6 sm:p-10">
            <RsvpForm />
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="border-t border-espresso/10 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Questions?" title="Reach out to" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {WEDDING.contacts.map((contact) => (
              <li key={contact.name} className="text-center">
                <p className="font-display text-3xl">{contact.name}</p>
                <p className="mt-1 text-sm tabular-nums text-espresso/70">{formatPhone(contact.phone)}</p>
                <div className="mt-4 flex justify-center gap-5">
                  <a href={`tel:${contact.phone}`} className={smallLink}>Call</a>
                  <a href={whatsappUrl(contact.phone)} target="_blank" rel="noopener noreferrer" className={smallLink}>
                    WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Photo sharing + sign-off */}
      <footer className="bg-espresso px-6 py-20 text-center text-cream sm:py-24">
        <Eyebrow className="text-caramel">On the day</Eyebrow>
        <h2 className="mt-3 text-balance font-display text-4xl font-medium sm:text-5xl">Share your photos with us</h2>
        <p className="mx-auto mt-4 max-w-md text-cream/75">
          Took a picture we'd love? Upload it to our gallery so we can relive every moment.
        </p>
        <Link
          to="/upload"
          className={`mt-8 inline-flex items-center justify-center rounded-full bg-cream px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-espresso transition hover:bg-caramel ${focusRing}`}
        >
          Upload photos
        </Link>
        <Ornament className="mt-16 text-caramel" />
        <p className="mt-6 font-display text-2xl italic">
          With love, {groom.firstName} &amp; {bride.firstName}
        </p>
      </footer>
    </div>
  );
}
