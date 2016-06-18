var Application = function($steps) {
  this.$steps = $steps;

  this.initSteps();
  this.initBindings();
  this.enableFullscreenButton();
  this.enableHistorySupport();
  this.initShareButtons();
};

Application.prototype = {
  nextSlide: function() {
    var $currentSlide = this.$steps.filter('.step--active');
    var $nextSlide = $currentSlide.next('.step');

    if($currentSlide.data('step').hasCaptureApplicationNav('next')) {
      return $currentSlide.data('step').captureApplicationNav('next');
    }

    this.gotoSlide($nextSlide.data('url') || undefined);
  },

  prevSlide: function() {
    var $currentSlide = this.$steps.filter('.step--active');
    var $nextSlide = $currentSlide.prev('.step');

    if($currentSlide.data('step').hasCaptureApplicationNav('prev')) {
      return $currentSlide.data('step').captureApplicationNav('prev');
    }

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
        var $target = $(this);

        if($target.is('svg') || $target.is('use')) {
          $target = $target.closest('a');
        }

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
  },

  initShareButtons: function() {
    $('.js-share-button').on('click.share', function(e) {
      e.preventDefault();

      var url = $(this).attr('href');
      var width = $(window).width() - 150;
      var height = $(window).height() - 150;

      if(width > 600) {
        width = 600;
      }

      if(height > 400) {
        height = 400;
      }

      var popupCenter = function(url, title, w, h) {
          var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
          var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

          var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
          var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

          var left = ((width / 2) - (w / 2)) + dualScreenLeft;
          var top = ((height / 2) - (h / 2)) + dualScreenTop;
          var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

          if (window.focus) {
            newWindow.focus();
          }
      }

      popupCenter(url, 'Geschichte teilen', width, height);
    });
  },
};