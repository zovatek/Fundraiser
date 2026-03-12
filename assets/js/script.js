const isInPagesFolder = window.location.pathname.includes("/pages/");
const navbarPath = isInPagesFolder ? "../components/navbar.html" : "components/navbar.html";
const footerPath = isInPagesFolder ? "../components/footer.html" : "components/footer.html";

fetch(navbarPath)
    .then(response => response.text())
    .then(data => {
        const navbarContainer = document.getElementById("navbar");
        if (navbarContainer) {
            navbarContainer.innerHTML = data;

            // If on the mutual-fund page, rewrite dropdown links to plain anchors
            // so "Equity Funds" -> "#equity" instead of "pages/mutual-fund.html#equity"
            const isMutualFundPage = window.location.pathname.endsWith("mutual-fund.html");
            if (isMutualFundPage) {
                navbarContainer.querySelectorAll("a[href]").forEach(anchor => {
                    const href = anchor.getAttribute("href");
                    const match = href && href.match(/mutual-fund\.html(#.+)$/);
                    if (match) {
                        anchor.setAttribute("href", match[1]);
                        anchor.addEventListener("click", function(e) {
                            e.preventDefault();
                            // Delegate to the sidebar link so mutual-funds.js handles it
                            const sidebarLink = document.querySelector(`.sidebar a[href="${match[1]}"]`);
                            if (sidebarLink) {
                                sidebarLink.click();
                                sidebarLink.scrollIntoView({ behavior: "smooth", block: "nearest" });
                            }
                        });
                    }
                });
            }

            const toggle = navbarContainer.querySelector(".menu-toggle");
            const navLinks = navbarContainer.querySelector(".nav-links");
            if (toggle && navLinks) {
                toggle.addEventListener("click", () => {
                    navLinks.classList.toggle("open");
                });
            }

            // Mobile: tap to toggle all dropdown menus (Services, Tools, etc.)
            if (window.matchMedia("(max-width: 768px)").matches) {
                const dropdownItems = navbarContainer.querySelectorAll(".nav-item-has-dropdown");

                dropdownItems.forEach(item => {
                    const trigger = item.querySelector(".nav-link-services, .nav-link-tools");
                    const dropdown = item.querySelector(".services-dropdown, .tools-dropdown");

                    if (!trigger || !dropdown) return;

                    trigger.addEventListener("click", (e) => {
                        e.preventDefault();
                        dropdown.classList.toggle("open");
                    });

                    document.addEventListener("click", (e) => {
                        if (!item.contains(e.target)) {
                            dropdown.classList.remove("open");
                        }
                    });
                });
            }
        }
    });

fetch(footerPath)
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById("footer");
        if (footerContainer) {
            footerContainer.innerHTML = data;

            // Normalize footer links so they work from both root and /pages routes.
            const allFooterAnchors = footerContainer.querySelectorAll("a[href]");
            allFooterAnchors.forEach(anchor => {
                const href = anchor.getAttribute("href");
                if (!href) return;

                const isExternalOrProtocol = /^(https?:|mailto:|tel:|javascript:)/i.test(href);
                if (isExternalOrProtocol) return;

                // Hash links should target index sections when we are inside /pages.
                if (href.startsWith("#")) {
                    if (isInPagesFolder) {
                        anchor.setAttribute("href", `../index.html${href}`);
                    }
                    return;
                }

                // Relative links like pages/mutual-fund.html need one level up from /pages.
                if (isInPagesFolder && href.startsWith("pages/")) {
                    anchor.setAttribute("href", `../${href}`);
                }
            });

            // Smooth scroll for section links when we are on index/home page.
            const footerLinks = footerContainer.querySelectorAll(".footer-smooth-link");
            footerLinks.forEach(link => {
                link.addEventListener("click", function (e) {
                    const href = this.getAttribute("href");
                    if (!href || !href.startsWith("#") || isInPagesFolder) return;

                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);

                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                });
            });
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
