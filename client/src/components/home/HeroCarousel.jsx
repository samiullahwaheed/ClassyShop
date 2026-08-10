import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import { useGetHomeSlidesQuery } from '../../features/content/contentApi.js';

export default function HeroCarousel() {
  const { data: slides = [] } = useGetHomeSlidesQuery();

  if (!slides.length) return null;

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 5000 }}
      loop={slides.length > 1}
      className="hero-carousel"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide._id}>
          <div
            className="flex min-h-[280px] items-center bg-cover bg-center px-8 py-16 sm:min-h-[380px] sm:px-16"
            style={{ backgroundImage: `url(${slide.image?.url})` }}
          >
            <div className="max-w-md rounded-xl bg-white/85 p-6">
              {slide.title && <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{slide.title}</h2>}
              {slide.subtitle && <p className="mt-2 text-gray-600">{slide.subtitle}</p>}
              {slide.ctaText && (
                <Link
                  to={slide.link || '/products'}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  {slide.ctaText} →
                </Link>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
