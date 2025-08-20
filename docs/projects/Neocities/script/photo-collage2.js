class DraggablePhoto2 {
    constructor(element2, x2, y2, rotation2, imageUrl2) {
        this.element2 = element2;
        this.x2 = x2;
        this.y2 = y2;
        this.rotation2 = rotation2;
        this.imageUrl2 = imageUrl2;
        this.isDragging2 = false;
        this.dragOffsetX2 = 0;
        this.dragOffsetY2 = 0;
        this.zIndex2 = 1;
        this.clickStartTime2 = 0;
        this.hasMoved2 = false;

        this.updatePosition2();
        this.bindEvents2();
    }

    updatePosition2() {
        this.element2.style.left = this.x2 + 'px';
        this.element2.style.top = this.y2 + 'px';
        this.element2.style.transform = `rotate(${this.rotation2}deg)`;
        this.element2.style.zIndex = this.zIndex2;
    }

    bindEvents2() {
        this.element2.addEventListener('mousedown', (e2) => this.onMouseDown2(e2));
        document.addEventListener('mousemove', (e2) => this.onMouseMove2(e2));
        document.addEventListener('mouseup', () => this.onMouseUp2());

        // Touch events for mobile
        this.element2.addEventListener('touchstart', (e2) => this.onTouchStart2(e2));
        document.addEventListener('touchmove', (e2) => this.onTouchMove2(e2));
        document.addEventListener('touchend', () => this.onTouchEnd2());
    }

    onMouseDown2(e2) {
        this.isDragging2 = true;
        this.hasMoved2 = false;
        this.clickStartTime2 = Date.now();
        this.dragOffsetX2 = e2.clientX - this.x2;
        this.dragOffsetY2 = e2.clientY - this.y2;

        currentZIndex2++;
        this.zIndex2 = currentZIndex2;
        this.updatePosition2();

        e2.preventDefault();
    }

    onMouseMove2(e2) {
        if (this.isDragging2) {
            const newX2 = e2.clientX - this.dragOffsetX2;
            const newY2 = e2.clientY - this.dragOffsetY2;

            const moveDistance2 = Math.sqrt(Math.pow(newX2 - this.x2, 2) + Math.pow(newY2 - this.y2, 2));
            if (moveDistance2 > 5) {
                this.hasMoved2 = true;
            }

            this.x2 = newX2;
            this.y2 = newY2;

            const containerWidth2 = window.innerWidth;
            const containerHeight2 = window.innerHeight;
            const photoWidth2 = 230;
            const photoHeight2 = 129;

            this.x2 = Math.max(-50, Math.min(containerWidth2 - photoWidth2 + 50, this.x2));
            this.y2 = Math.max(-50, Math.min(containerHeight2 - photoHeight2 + 50, this.y2));

            this.updatePosition2();
        }
    }

    onMouseUp2() {
        if (this.isDragging2) {
            const clickDuration2 = Date.now() - this.clickStartTime2;

            if (clickDuration2 < 300 && !this.hasMoved2) {
                showLightbox2(this.imageUrl2);
            }

            this.isDragging2 = false;
            this.hasMoved2 = false;
        }
    }

    onTouchStart2(e2) {
        e2.preventDefault();
        const touch2 = e2.touches[0];
        this.onMouseDown2({
            clientX: touch2.clientX,
            clientY: touch2.clientY,
            preventDefault: () => {}
        });
    }

    onTouchMove2(e2) {
        e2.preventDefault();
        if (e2.touches.length > 0) {
            const touch2 = e2.touches[0];
            this.onMouseMove2({ clientX: touch2.clientX, clientY: touch2.clientY });
        }
    }

    onTouchEnd2() {
        this.onMouseUp2();
    }
}

const container2 = document.getElementById('q-container');
const photos2 = [];
let currentZIndex2 = 1;
  const imageUrls2 = [

            '/assets/image1.png',

            '/assets/image2.png', 

            '/assets/image3.png',

            '/assets/image4.png',

            '/assets/image5.png'

        ];

const positions2 = [
    { x: 200, y: 150, rotation: -4 },
    { x: 450, y: 90, rotation: 12 },
    { x: 300, y: 300, rotation: -15 },
    { x: 500, y: 250, rotation: 5 },
    { x: 150, y: 350, rotation: 18 }
];

for (let i2 = 0; i2 < 5; i2++) {
    const element2 = document.createElement('div');
    element2.className = 'photo';

    const content2 = document.createElement('div');
    content2.className = 'photo-content';

    const img2 = document.createElement('img');
    img2.src = imageUrls2[i2];
    img2.alt = `Photo ${i2 + 1}`;
    img2.draggable = false;

    content2.appendChild(img2);
    element2.appendChild(content2);
    container2.appendChild(element2);

    const pos2 = positions2[i2];

    const screenWidth2 = window.innerWidth;
    const screenHeight2 = window.innerHeight;

    let adjustedX2 = pos2.x;
    let adjustedY2 = pos2.y;

    if (screenWidth2 < 800) {
        adjustedX2 = (pos2.x / 800) * (screenWidth2 - 250) + 50;
        adjustedY2 = (pos2.y / 600) * (screenHeight2 - 200) + 50;
    }

    photos2.push(new DraggablePhoto2(element2, adjustedX2, adjustedY2, pos2.rotation, imageUrls2[i2]));
}

const lightbox2 = document.getElementById('lightbox');
const lightboxImage2 = document.getElementById('lightbox-image');
const closeButton2 = document.getElementById('close-button');

function showLightbox2(imageUrl2) {
    lightboxImage2.src = imageUrl2;
    lightbox2.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideLightbox2() {
    lightbox2.classList.remove('show');
    document.body.style.overflow = 'auto';
}

closeButton2.addEventListener('click', hideLightbox2);

lightbox2.addEventListener('click', (e2) => {
    if (e2.target === lightbox2) {
        hideLightbox2();
    }
});

document.addEventListener('keydown', (e2) => {
    if (e2.key === 'Escape' && lightbox2.classList.contains('show')) {
        hideLightbox2();
    }
});

window.addEventListener('resize', () => {
    const screenWidth2 = window.innerWidth;
    const screenHeight2 = window.innerHeight;

    photos2.forEach((photo2, i2) => {
        const pos2 = positions2[i2];

        if (screenWidth2 < 800) {
            photo2.x2 = (pos2.x / 800) * (screenWidth2 - 250) + 50;
            photo2.y2 = (pos2.y / 600) * (screenHeight2 - 200) + 50;
        } else {
            photo2.x2 = pos2.x;
            photo2.y2 = pos2.y;
        }

        photo2.x2 = Math.max(-50, Math.min(screenWidth2 - 150, photo2.x2));
        photo2.y2 = Math.max(-50, Math.min(screenHeight2 - 100, photo2.y2));

        photo2.updatePosition2();
    });
});
