 
import style from "./LogoLoader.module.css";

import logo_1 from "../../../../public/assets/images/logo_in_sections/1.png";
import logo_2 from "../../../../public/assets/images/logo_in_sections/2.png";
import logo_3 from "../../../../public/assets/images/logo_in_sections/3.png";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

function AnimatedLogo() {
	const didAnimate = useRef(false);
	 
	useEffect(() => {
        if (didAnimate.current) return;
        gsap.timeline({ repeat: -1, yoyo: true })
            .fromTo(
                ".logo",
                { x: 50, y: 10, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.5 }
            )
            .fromTo(
                ".logo_1",
                { x: 50, y: 15, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.5 },
                "-=0.25"
            );
        didAnimate.current = true;
    }, []);
	 

	return (
		<div className={`${style.AnimatedLogo} animated_logo`}>
			<div className={`${style.images} ${style.img_1} logo_1`}>
				<Image height={400} alt="logo" src={logo_1} />
			</div>
			<div className={`${style.images} ${style.img_2} logo_1`}>
				<Image fill alt="logo" src={logo_2} />
			</div>
			<div className={`${style.img_3} logo`}>
				<Image width={100} height={100} alt="logo" src={logo_3} />
			</div>
		</div>
	);
}

 

export default AnimatedLogo;
