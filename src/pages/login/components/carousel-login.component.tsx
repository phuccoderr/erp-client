import { Carousel, CarouselContent, CarouselItem, Image } from "@components/ui";
import imgHrm from "@assets/login/login-page-hrm.png";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const CarouselLoginComponent = () => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="flex gap-2">
      <Carousel
        opts={{
          loop: true,
          slidesToScroll: 1,
          dragFree: false,
          watchDrag: false,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent className="h-175">
          <CarouselItem>
            <Image
              src={imgHrm}
              className="object-fill"
              alt="Product and Inventory Management"
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              src={imgHrm}
              className="object-fill"
              alt="Product and Inventory Management"
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              src={imgHrm}
              className="object-fill"
              alt="Product and Inventory Management"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselLoginComponent;
