<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Carousel',
  components: {
    swiper,
    swiperSlide
  },
  render (h) {
    return (
      <swiper class="um-carousel" options={this.swiperOption}>
        {
          this.$slots.default.filter(vnode => vnode.tag).map(
            vnode => <swiperSlide class={this.swiping ? '' : 'swiper-no-swiping'}>{vnode}</swiperSlide>
          )
        }
        {
          this.dots ? <div class="swiper-pagination" slot="pagination"></div> : ''
        }
      </swiper>
    )
  },
  data () {
    return {
      swiperOption: {
        on: {
          slideChangeTransitionEnd: this.afterChange,
          slideChangeTransitionStart: this.beforeChange
        },
        speed: this.speed,
        autoHeight: true,
        autoplay: this.autoplay ? { delay: Math.ceil(this.autoplayInterval / 4) } : false,
        initialSlide: this.selectedIndex,
        loop: this.infinite,
        direction: this.vertical ? 'vertical' : 'horizontal',
        pagination: {
          el: this.dots ? '.swiper-pagination' : null
        }
      }
    }
  },
  methods: {
    afterChange () {
      this.$emit('afterChange')
    },
    beforeChange () {
      this.$emit('beforeChange')
    }
  },
  props: {
    selectedIndex: {
      type: Number,
      default: 0
    },
    dots: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplayInterval: {
      type: Number,
      default: 3000
    },
    infinite: {
      type: Boolean,
      default: false
    },
    dotStyle: {
      type: Object
    },
    dotActiveStyle: {
      type: Object
    },
    easing: {
      type: Function
    },
    swipeSpeed: {
      type: Number,
      default: 12
    },
    swiping: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 300
    }
  }
}
</script>
<style>
.swiper-pagination-bullet {
  background: #ccc;
  opacity: 1;
}

.swiper-pagination-bullet-active {
  background: #888;
}

.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal>.swiper-pagination-bullets {
  bottom: 0;
  left: 0;
  width: 100%;
}

.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 0 3px;
}
</style>
