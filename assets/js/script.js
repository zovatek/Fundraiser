fetch("components/navbar.html")
    .then(response => response.text())
    .then(data => {
        const navbarContainer = document.getElementById("navbar");
        if (navbarContainer) {
            navbarContainer.innerHTML = data;

            const toggle = navbarContainer.querySelector(".menu-toggle");
            const navLinks = navbarContainer.querySelector(".nav-links");
            if (toggle && navLinks) {
                toggle.addEventListener("click", () => {
                    navLinks.classList.toggle("open");
                });
            }

            const servicesItem = navbarContainer.querySelector(".services-item");
            if (servicesItem) {
                const servicesLink = servicesItem.querySelector(".nav-link-services");
                const servicesDropdown = servicesItem.querySelector(".services-dropdown");

                // On small screens, open dropdown on tap (no hover support)
                if (servicesLink && servicesDropdown && window.matchMedia("(max-width: 768px)").matches) {
                    servicesLink.addEventListener("click", (e) => {
                        e.preventDefault();
                        servicesDropdown.classList.toggle("open");
                    });

                    document.addEventListener("click", (e) => {
                        if (!servicesItem.contains(e.target)) {
                            servicesDropdown.classList.remove("open");
                        }
                    });
                }
            }

            const toolsItem = navbarContainer.querySelector(".tools-item");
            if (toolsItem) {
                const toolsLink = toolsItem.querySelector(".nav-link-tools");
                const toolsDropdown = toolsItem.querySelector(".tools-dropdown");

                // On small screens, open Tools dropdown on tap
                if (toolsLink && toolsDropdown && window.matchMedia("(max-width: 768px)").matches) {
                    toolsLink.addEventListener("click", (e) => {
                        e.preventDefault();
                        toolsDropdown.classList.toggle("open");
                    });

                    document.addEventListener("click", (e) => {
                        if (!toolsItem.contains(e.target)) {
                            toolsDropdown.classList.remove("open");
                        }
                    });
                }
            }
        }
    });

fetch("components/footer.html")
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById("footer");
        if (footerContainer) {
            footerContainer.innerHTML = data;
        }
    });


    let slides = document.querySelectorAll(".slide");
    let current = 0;

    if (slides.length) {
        const indicatorsContainer = document.querySelector(".hero-indicators");
        let indicators = [];

        function showSlide(index){
            slides.forEach(slide => slide.classList.remove("active"));
            slides[index].classList.add("active");

            if (indicators.length) {
                indicators.forEach(dot => dot.classList.remove("active"));
                indicators[index].classList.add("active");
            }
        }

        if (indicatorsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement("span");
                dot.classList.add("indicator-dot");
                if (index === 0) dot.classList.add("active");
                dot.addEventListener("click", () => {
                    current = index;
                    showSlide(current);
                    resetAutoSlide();
                });
                indicatorsContainer.appendChild(dot);
                indicators.push(dot);
            });
        }

        let autoSlideInterval = null;

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                current = (current + 1) % slides.length;
                showSlide(current);
            }, 5000);
        }

        function resetAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
            startAutoSlide();
        }

        // Initialize first slide state and start auto sliding
        showSlide(current);
        startAutoSlide();
    }


 

const counters = document.querySelectorAll('.counter');

const runCounter = (counter)=>{
  const target = +counter.getAttribute('data-target');
  let count = 0;
  const increment = target / 100;

  const update = ()=>{
    count += increment;
    if(count < target){
      counter.innerText = Math.ceil(count);
      requestAnimationFrame(update);
    } else{
      counter.innerText = target + "+";
    }
  };

    update();
};

// Observer to trigger About section counters once
const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.counter').forEach(runCounter);
            statsObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.about-stats').forEach(el => {
    statsObserver.observe(el);
});

// Observer to trigger Milestones (Achievements) counters once
const achievementsSection = document.querySelector('.achievements');

if (achievementsSection) {
    const achievementsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.counter').forEach(runCounter);
                achievementsObserver.unobserve(entry.target);
            }
        });
    });

    achievementsObserver.observe(achievementsSection);
}

// Generic fade-up animation for any .fade-scroll element
const cards = document.querySelectorAll('.fade-scroll');

const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('show');
            }, index * 120); // staggered like AOS fade-up
            fadeObserver.unobserve(entry.target);
        }
    });
});

cards.forEach(card => {
    fadeObserver.observe(card);
});

// Dedicated scroll animation for services cards after About section
const serviceCards = document.querySelectorAll('.services-right .service-box');

if (serviceCards.length) {
    const serviceObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('service-visible');
                serviceObserver.unobserve(card);
            }
        });
    }, { threshold: 0.2 });

    serviceCards.forEach((card, index) => {
        card.style.setProperty('--service-index', index);
        serviceObserver.observe(card);
    });
}
 
// Optional single-image animation; guard if element is missing
const img = document.querySelector('.unique-anim');

if (img) {
    const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                imgObserver.unobserve(entry.target);
            }
        });
    });

    imgObserver.observe(img);
}

 

  

//function openPopup(title,text,link){
 // document.getElementById("popupTitle").innerText=title;
  //document.getElementById("popupText").innerText=text;
 // document.getElementById("popupLink").href=link;
 // document.getElementById("servicePopup").style.display="flex";
//}

//function closePopup(){
//  document.getElementById("servicePopup").style.display="none";
//}
