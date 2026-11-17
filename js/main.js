/**
 * PULSEFLOW AI - MAIN INTERACTIVITY SCRIPT
 * Sankar Group Front-End Development Internship Assignment
 * Features: Responsive Navigation, Theme Toggle, Modal Handlers,
 * Dynamic Pricing, Interactive Calculator, Step Switcher,
 * Real-time Form Validation, FAQ Accordion, and Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================================
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // ========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('pulseflow_theme') || 'dark';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pulseflow_theme', theme);
  }

  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
    });
  }

  // ========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // ========================================================================
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileCloseBtn = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');

  function openMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }

  mobileToggle?.addEventListener('click', openMobileNav);
  mobileCloseBtn?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', closeMobileNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // ========================================================================
  // 3. SMOOTH NAVIGATION & ACTIVE LINK TRACKING
  // ========================================================================
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ========================================================================
  // 4. HERO DASHBOARD SIMULATION
  // ========================================================================
  const simulateBtn = document.getElementById('simulateBtn');
  const syncRow = document.getElementById('mockupSyncRow');
  const liveCountElem = document.getElementById('mockupLiveCount');

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      simulateBtn.disabled = true;
      const originalText = simulateBtn.innerHTML;
      simulateBtn.innerHTML = `
        <svg class="spin-icon" style="animation: spin 1s linear infinite; width:14px; height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg> Executing Agents...
      `;

      if (syncRow) {
        const badge = syncRow.querySelector('.pipeline-status-badge');
        if (badge) {
          badge.className = 'pipeline-status-badge badge-running';
          badge.textContent = 'Optimizing Engine...';
        }
      }

      setTimeout(() => {
        if (liveCountElem) {
          const current = parseInt(liveCountElem.textContent.replace(/[^0-9]/g, '')) || 14200;
          liveCountElem.textContent = (current + 184).toLocaleString() + ' ops';
        }

        if (syncRow) {
          const badge = syncRow.querySelector('.pipeline-status-badge');
          if (badge) {
            badge.className = 'pipeline-status-badge badge-success';
            badge.textContent = '100% Autonomous Complete';
          }
        }

        simulateBtn.disabled = false;
        simulateBtn.innerHTML = originalText;
        showToast('Pipeline execution completed successfully with 0 errors.', 'success');
      }, 1400);
    });
  }

  // ========================================================================
  // 5. FEATURE CATEGORY FILTERS
  // ========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const featureCards = document.querySelectorAll('.feature-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      featureCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================================================
  // 6. "HOW IT WORKS" INTERACTIVE STEP SELECTOR
  // ========================================================================
  const stepItems = document.querySelectorAll('.step-nav-item');
  const previewPanes = document.querySelectorAll('.preview-step-pane');

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = item.getAttribute('data-step');

      stepItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      previewPanes.forEach(pane => {
        if (pane.getAttribute('data-step') === targetStep) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // ========================================================================
  // 7. INTERACTIVE ROI CALCULATOR
  // ========================================================================
  const teamRange = document.getElementById('teamRange');
  const teamSizeLabel = document.getElementById('teamSizeLabel');
  const hoursSavedElem = document.getElementById('hoursSavedVal');
  const costReductionElem = document.getElementById('costReductionVal');
  const velocityGainElem = document.getElementById('velocityGainVal');

  function calculateROI(size) {
    const hours = size * 14;
    const dollars = Math.round(hours * 45 * 12);
    const velocity = Math.min(180 + size * 0.4, 340).toFixed(0);

    if (teamSizeLabel) teamSizeLabel.textContent = `${size} Members`;
    if (hoursSavedElem) hoursSavedElem.textContent = `${hours.toLocaleString()} hrs / mo`;
    if (costReductionElem) costReductionElem.textContent = `$${dollars.toLocaleString()} / yr`;
    if (velocityGainElem) velocityGainElem.textContent = `+${velocity}% Velocity`;
  }

  if (teamRange) {
    teamRange.addEventListener('input', (e) => {
      calculateROI(parseInt(e.target.value, 10));
    });
    // Init calculator
    calculateROI(parseInt(teamRange.value, 10));
  }

  // ========================================================================
  // 8. PRICING BILLING CYCLE TOGGLE (MONTHLY / ANNUALLY)
  // ========================================================================
  const billingToggle = document.getElementById('billingToggle');
  const priceStarter = document.getElementById('priceStarter');
  const priceGrowth = document.getElementById('priceGrowth');
  const priceEnterprise = document.getElementById('priceEnterprise');
  const pricePeriods = document.querySelectorAll('.price-period');

  const pricingData = {
    monthly: {
      starter: '29',
      growth: '79',
      enterprise: '249',
      period: '/ month'
    },
    annual: {
      starter: '23',
      growth: '63',
      enterprise: '199',
      period: '/ month, billed yearly'
    }
  };

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const mode = billingToggle.checked ? 'annual' : 'monthly';
      const data = pricingData[mode];

      if (priceStarter) priceStarter.textContent = data.starter;
      if (priceGrowth) priceGrowth.textContent = data.growth;
      if (priceEnterprise) priceEnterprise.textContent = data.enterprise;

      pricePeriods.forEach(p => {
        p.textContent = data.period;
      });

      showToast(`Switched to ${mode === 'annual' ? 'Annual (20% Savings)' : 'Monthly'} billing`, 'info');
    });
  }

  // ========================================================================
  // 9. FAQ ACCORDION
  // ========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ========================================================================
  // 10. CLIENT-SIDE VALIDATION & DEMO REQUEST FORM
  // ========================================================================
  const demoForm = document.getElementById('demoRequestForm');
  const formSuccessCard = document.getElementById('formSuccessCard');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const successNameElem = document.getElementById('successUserName');
  const successEmailElem = document.getElementById('successUserEmail');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateInput(input, condition, errorMsg) {
    const feedback = input.nextElementSibling;
    if (!condition) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (feedback && feedback.classList.contains('form-feedback')) {
        feedback.textContent = errorMsg;
      }
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    }
  }

  // Real-time blur validation
  const fullNameInput = document.getElementById('fullName');
  const workEmailInput = document.getElementById('workEmail');
  const companyInput = document.getElementById('companyName');
  const teamSizeSelect = document.getElementById('teamSizeSelect');
  const agreeTermsCheckbox = document.getElementById('agreeTerms');

  fullNameInput?.addEventListener('blur', () => {
    validateInput(fullNameInput, fullNameInput.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).');
  });

  workEmailInput?.addEventListener('blur', () => {
    validateInput(workEmailInput, emailRegex.test(workEmailInput.value.trim()), 'Please enter a valid business email address.');
  });

  companyInput?.addEventListener('blur', () => {
    validateInput(companyInput, companyInput.value.trim().length >= 2, 'Please enter your company or organization name.');
  });

  teamSizeSelect?.addEventListener('change', () => {
    validateInput(teamSizeSelect, teamSizeSelect.value !== '', 'Please select your team size.');
  });

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateInput(fullNameInput, fullNameInput.value.trim().length >= 2, 'Please enter your full name.');
      const isEmailValid = validateInput(workEmailInput, emailRegex.test(workEmailInput.value.trim()), 'Please enter a valid work email.');
      const isCompanyValid = validateInput(companyInput, companyInput.value.trim().length >= 2, 'Please enter your company name.');
      const isTeamValid = validateInput(teamSizeSelect, teamSizeSelect.value !== '', 'Please select your team size.');
      const isTermsValid = agreeTermsCheckbox ? agreeTermsCheckbox.checked : true;

      if (!isTermsValid) {
        showToast('Please check the terms and privacy consent box.', 'info');
        return;
      }

      if (isNameValid && isEmailValid && isCompanyValid && isTeamValid) {
        const submitBtn = demoForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg class="spin-icon" style="animation: spin 1s linear infinite; width:16px; height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg> Booking Demo...
          `;
        }

        // Simulate network latency for realistic UX
        setTimeout(() => {
          if (successNameElem) successNameElem.textContent = fullNameInput.value.trim();
          if (successEmailElem) successEmailElem.textContent = workEmailInput.value.trim();

          demoForm.style.display = 'none';
          if (formSuccessCard) formSuccessCard.style.display = 'block';

          showToast('Demo request received! Check your inbox shortly.', 'success');

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Personalized Demo';
          }
        }, 900);
      } else {
        showToast('Please correct the highlighted form errors.', 'info');
      }
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      demoForm.reset();
      const inputs = demoForm.querySelectorAll('.form-control');
      inputs.forEach(i => {
        i.classList.remove('is-valid', 'is-invalid');
      });
      if (formSuccessCard) formSuccessCard.style.display = 'none';
      demoForm.style.display = 'block';
    });
  }

  // ========================================================================
  // 11. SIGN-UP / GET STARTED MODAL HANDLERS
  // ========================================================================
  const authModal = document.getElementById('authModal');
  const authModalClose = document.getElementById('authModalClose');
  const authModalForm = document.getElementById('authModalForm');
  const triggerAuthButtons = document.querySelectorAll('.trigger-auth-modal');
  const modalPlanInput = document.getElementById('modalSelectedPlan');

  function openAuthModal(plan = 'Free Starter') {
    if (!authModal) return;
    if (modalPlanInput) modalPlanInput.value = plan;
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerAuthButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Free Starter';
      openAuthModal(plan);
    });
  });

  authModalClose?.addEventListener('click', closeAuthModal);

  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal?.classList.contains('active')) {
      closeAuthModal();
    }
  });

  if (authModalForm) {
    authModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('modalEmail');
      const pass = document.getElementById('modalPassword');

      if (!email || !emailRegex.test(email.value.trim())) {
        showToast('Please enter a valid email address.', 'info');
        email?.focus();
        return;
      }

      if (!pass || pass.value.length < 6) {
        showToast('Password must be at least 6 characters.', 'info');
        pass?.focus();
        return;
      }

      const submitBtn = authModalForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
      }

      setTimeout(() => {
        closeAuthModal();
        showToast(`Welcome aboard! Account created for ${email.value.trim()}`, 'success');
        authModalForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create My Account';
        }
      }, 800);
    });
  }

  // ========================================================================
  // 12. FOOTER NEWSLETTER SUBSCRIPTION
  // ========================================================================
  const newsletterForm = document.getElementById('footerNewsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!newsletterEmail || !emailRegex.test(newsletterEmail.value.trim())) {
        showToast('Please enter a valid email for updates.', 'info');
        newsletterEmail?.focus();
        return;
      }

      showToast(`Subscribed! Updates will be sent to ${newsletterEmail.value.trim()}`, 'success');
      newsletterForm.reset();
    });
  }

  // ========================================================================
  // 13. BACK-TO-TOP BUTTON
  // ========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 450) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ========================================================================
  // 14. GLOBAL TOAST NOTIFICATION UTILITY
  // ========================================================================
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-emerald)"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--primary-light)"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3800);
  }

  // Expose toast to global scope for tests if needed
  window.pulseflowToast = showToast;
});
