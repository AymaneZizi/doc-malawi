var Application = function($steps) {
  this.$steps = $steps;

  this.initSteps();
  this.initBindings();
  this.enableFullscreenButton();
  this.enableHistorySupport();
};

Application.prototype = {
  nextSlide: function() {
    var $currentSlide = this.$steps.filter('.step--active');
    var $nextSlide = $currentSlide.next('.step');

    this.gotoSlide($nextSlide.data('url') || undefined);
  },

  prevSlide: function() {
    var $currentSlide = this.$steps.filter('.step--active');
    var $nextSlide = $currentSlide.prev('.step');

    this.gotoSlide($nextSlide.data('url') || undefined);
  },

  gotoSlide: function(slug) {
    var $targetSlide;
    var $currentSlide = this.$steps.filter('.step--active');

    if(!slug) {
      $targetSlide = this.$steps.eq(0);
    } else {
      $targetSlide = this.$steps.filter('[data-url="' + slug + '"]');
    }

    $currentSlide.data('step').destroy(function() {
      $targetSlide.data('step').init();
    });
  },

  enableFullscreenButton: function() {
    if(!screenfull.enabled) {
      return;
    }

    $('.header__button').removeClass('header__button--is-hidden');

    $('.js-toggle-fullscreen')
      .on('click', function(e) {
        e.preventDefault();

        if (screenfull.enabled) {
          screenfull.request();
        }
      });
  },

  enableHistorySupport: function() {
    if(!history) {
      return;
    }

    var self = this;
    var currentUrl = window.location.href;
    var urlParts = currentUrl.split('/');
    var lastUrlPart = urlParts[urlParts.length - 1];

    if(!lastUrlPart) {
      return;
    }

    $.each(this.$steps, function() {
      var $step = $(this);

      if($step.data('url') === lastUrlPart) {
        self.gotoSlide($step.data('url'));
        return false;
      }
    });
  },

  initSteps: function() {
    var self = this;

    $.each(this.$steps, function(index) {
      var $this = $(this);

      $this.data('step', new Step($this, {'$steps': self.$steps}));
      //$this.css('z-index', self.$steps.length - index);
    });
  },

  initBindings: function() {
    var self = this;

    $(window)
      .on('keydown.main', function(e) {
        switch(e.which) {
          case 39:
            self.nextSlide();
            break;
          case 37:
            self.prevSlide();
            break;
        }
      })
      .on('swiperight.main swipedown.main', function() {
        self.prevSlide();
      })
      .on('swipeleft.main swipeup.main', function() {
        self.nextSlide();
      });

    $('.js-step-goto')
      .on('click', function(e) {
        e.preventDefault();
        self.gotoSlide($(this).attr('href'));
      });

    $('.app-navigation__button--prev')
      .on('click.app', function(e) {
        self.prevSlide();
      });

    $('.app-navigation__button--next')
      .on('click.app', function(e) {
        self.nextSlide();
      });
  }
};
