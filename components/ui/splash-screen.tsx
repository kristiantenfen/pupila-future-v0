'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const carouselImages = [
    '/carrosel/66e1f59c46a48a1c2a0604a7_hero1-p-1080.png',
    '/carrosel/66e1f5a5c08f6836381be00b_hero2-p-1080.png',
    '/carrosel/67102c37e170f6e2e7c92bd4_Hero 6-p-1080.png',
    '/carrosel/671029c05fa272f3cde3538d_Frame 1000001001-p-1080.png'
];

export function SplashScreen() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 4000);

        return () => {
            clearInterval(slideInterval);
        };
    }, []);

    const handleNavigation = (path: string) => {
        // Substitui a rota atual completamente
        router.replace(path);
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="splash-screen">
                <div className="splash-logo">
                    <Image
                        src="/logo-horizontal-positive.svg"
                        alt="Pupila Logo"
                        width={216}
                        height={25}
                        priority
                    />
                </div>
                <div className="splash-carousel">
                    {carouselImages.map((src, index) => (
                        <div
                            key={src}
                            className={`splash-carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <Image
                                src={src}
                                alt={`Slide ${index + 1}`}
                                width={1080}
                                height={720}
                                priority={index === 0}
                                className="rounded-lg shadow-2xl"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex gap-4">
                    <Link href="/campanhas/nova">
                        <button className="btn btn-primary">
                            Criar Campanha
                        </button>
                    </Link>
                    <Link href="/campanhas">
                        <button className="btn btn-primary">
                            Ver Campanhas
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    );
} 