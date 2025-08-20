class DraggablePhoto {
            constructor(element, x, y, rotation, imageUrl) {
                this.element = element;
                this.x = x;
                this.y = y;
                this.rotation = rotation;
                this.imageUrl = imageUrl;
                this.isDragging = false;
                this.dragOffsetX = 0;
                this.dragOffsetY = 0;
                this.zIndex = 1;
                this.clickStartTime = 0;
                this.hasMoved = false;
                
                this.updatePosition();
                this.bindEvents();
            }

            updatePosition() {
                this.element.style.left = this.x + 'px';
                this.element.style.top = this.y + 'px';
                this.element.style.transform = `rotate(${this.rotation}deg)`;
                this.element.style.zIndex = this.zIndex;
            }

            bindEvents() {
                this.element.addEventListener('mousedown', (e) => this.onMouseDown(e));
                document.addEventListener('mousemove', (e) => this.onMouseMove(e));
                document.addEventListener('mouseup', () => this.onMouseUp());
                
                // Touch events for mobile
                this.element.addEventListener('touchstart', (e) => this.onTouchStart(e));
                document.addEventListener('touchmove', (e) => this.onTouchMove(e));
                document.addEventListener('touchend', () => this.onTouchEnd());
            }

            onMouseDown(e) {
                this.isDragging = true;
                this.hasMoved = false;
                this.clickStartTime = Date.now();
                this.dragOffsetX = e.clientX - this.x;
                this.dragOffsetY = e.clientY - this.y;
                
                // Assign new z-index to bring to front
                currentZIndex++;
                this.zIndex = currentZIndex;
                this.updatePosition();
                
                e.preventDefault();
            }

            onMouseMove(e) {
                if (this.isDragging) {
                    const newX = e.clientX - this.dragOffsetX;
                    const newY = e.clientY - this.dragOffsetY;
                    
                    // Check if mouse has moved significantly
                    const moveDistance = Math.sqrt(Math.pow(newX - this.x, 2) + Math.pow(newY - this.y, 2));
                    if (moveDistance > 5) {
                        this.hasMoved = true;
                    }
                    
                    this.x = newX;
                    this.y = newY;
                    
                    // Keep within bounds
                    const containerWidth = window.innerWidth;
                    const containerHeight = window.innerHeight;
                    const photoWidth = 230;
                    const photoHeight = 129;
                    
                    this.x = Math.max(-50, Math.min(containerWidth - photoWidth + 50, this.x));
                    this.y = Math.max(-50, Math.min(containerHeight - photoHeight + 50, this.y));
                    
                    this.updatePosition();
                }
            }

            onMouseUp() {
                if (this.isDragging) {
                    const clickDuration = Date.now() - this.clickStartTime;
                    
                    // If it was a quick click without much movement, show lightbox
                    if (clickDuration < 300 && !this.hasMoved) {
                        showLightbox(this.imageUrl);
                    }
                    
                    this.isDragging = false;
                    this.hasMoved = false;
                    
                    // Keep the current z-index (don't reset to 1)
                    // This maintains the stacking order based on drag sequence
                }
            }

            onTouchStart(e) {
                e.preventDefault();
                const touch = e.touches[0];
                this.onMouseDown({ 
                    clientX: touch.clientX, 
                    clientY: touch.clientY,
                    preventDefault: () => {}
                });
            }

            onTouchMove(e) {
                e.preventDefault();
                if (e.touches.length > 0) {
                    const touch = e.touches[0];
                    this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
                }
            }

            onTouchEnd() {
                this.onMouseUp();
            }
        }

        // Initialize the photo gallery
        const container = document.getElementById('p-container');
        const photos = [];
        let currentZIndex = 1; // Global z-index counter
        const imageUrls = [
            '/assets/euv1.png',
            '/assets/euv2.png', 
            '/assets/euv3.png',
            '/assets/euv4.png',
            '/assets/euv5.png'
        ];

        // Create photos with collage-style positioning and rotation
        const positions = [
            { x: 200, y: 150, rotation: -4 },
            { x: 450, y: 90, rotation: 12 },
            { x: 300, y: 300, rotation: -15 },
            { x: 500, y: 250, rotation: 5 },
            { x: 150, y: 350, rotation: 18 }
        ];

        for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'photo';
            
            const content = document.createElement('div');
            content.className = 'photo-content';
            
            const img = document.createElement('img');
            img.src = imageUrls[i];
            img.alt = `Photo ${i + 1}`;
            img.draggable = false; // Prevent default image drag
            
            content.appendChild(img);
            element.appendChild(content);
            container.appendChild(element);
            
            const pos = positions[i];
            
            // Adjust positions for smaller screens
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            let adjustedX = pos.x;
            let adjustedY = pos.y;
            
            if (screenWidth < 800) {
                adjustedX = (pos.x / 800) * (screenWidth - 250) + 50;
                adjustedY = (pos.y / 600) * (screenHeight - 200) + 50;
            }
            
            photos.push(new DraggablePhoto(element, adjustedX, adjustedY, pos.rotation, imageUrls[i]));
        }

        // Lightbox functionality
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const closeButton = document.getElementById('close-button');

        function showLightbox(imageUrl) {
            lightboxImage.src = imageUrl;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function hideLightbox() {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        }

        // Close lightbox when clicking close button
        closeButton.addEventListener('click', hideLightbox);

        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) {
                hideLightbox();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            photos.forEach((photo, i) => {
                const pos = positions[i];
                
                if (screenWidth < 800) {
                    photo.x = (pos.x / 800) * (screenWidth - 250) + 50;
                    photo.y = (pos.y / 600) * (screenHeight - 200) + 50;
                } else {
                    photo.x = pos.x;
                    photo.y = pos.y;
                }
                
                // Keep within new bounds
                photo.x = Math.max(-50, Math.min(screenWidth - 150, photo.x));
                photo.y = Math.max(-50, Math.min(screenHeight - 100, photo.y));
                
                photo.updatePosition();
            });
        });