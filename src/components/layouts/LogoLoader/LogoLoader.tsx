
import style from "./LogoLoader.module.css";

import logo_1_white from "../../../../public/assets/images/logo_in_sections/white/1.png";
import logo_2_white from "../../../../public/assets/images/logo_in_sections/white/2.png";
import logo_3_white from "../../../../public/assets/images/logo_in_sections/white/3.png";

import logo_1_blue from "../../../../public/assets/images/logo_in_sections/blue/1.png";
import logo_2_blue from "../../../../public/assets/images/logo_in_sections/blue/2.png";
import logo_3_blue from "../../../../public/assets/images/logo_in_sections/blue/3.png";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";



function AnimatedLogo({ color = 'white' }: { color?: 'white' | 'blue' }) {
    const didAnimate = useRef(false);

    const logo: any = {
        logo_1_white: logo_1_white,
        logo_2_white: logo_2_white,
        logo_3_white: logo_3_white,

        logo_1_blue: logo_1_blue,
        logo_2_blue: logo_2_blue,
        logo_3_blue: logo_3_blue
    }

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
            )
            .fromTo(
                ".logo_2",
                { x: 50, y: 15, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.5 },
                "-=0.25"
            );
        didAnimate.current = true;


    }, []);


    return (
        <div className={`${style.AnimatedLogo} animated_logo`}>
            <div className={`${style.images} ${style.img_1} logo_1`}>
                <Image height={400} alt="logo" src={logo['logo_1_' + color]} />
            </div>
            <div className={`${style.images} ${style.img_2} logo_2`}>
                <Image fill alt="logo" src={logo['logo_2_' + color]} />
            </div>
            <div className={`${style.img_3} logo`}>
                <Image width={100} height={100} alt="logo" src={logo['logo_3_' + color]} />
            </div>
        </div>
    );
}



export default AnimatedLogo;
