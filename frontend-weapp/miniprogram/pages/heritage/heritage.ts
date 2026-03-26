Component({
  pageLifetimes: {
    show() {
      // 设置 tabBar 选中索引为 2（品牌馆）
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(2);
      }
    }
  },

  data: {
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARMx1bOq18igcZhn8ReJazVtYUjh-0TyfEMxbNO1aOD46_pqLjaxwoPy59WQrIOge6yMSwoQvWvUgyHZaOzHrsLyzqz5DnCMmCTK5Uyss_e7M4clO5wU72v0A9ifVJLc8RQKrqr5dt5oD_3o2Va7yzo2hUZ5ARySKRouA5lYQF9RKBgD1MCiM3nmJxFxeFHVUgn9esEtlZFOFty0s8g21d9dNCTiNE8qHuzo7NRIiIl8ydaT798xDllNY3kIopYCIJikir_XXgAEqQ',

    milestone1: {
      year: '1792',
      event: '传奇诞生',
      desc: '在瑞士汝拉山谷的深处，第一间钟表工坊正式创立，开启了长达两个世纪的制表传奇。',
      descEn: 'The Foundation in Jura Valley',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_PPHE5KadYXhgQxIK5JDb0eRVFmYkQ2LafzJasoCtELmd1VhZBXtFhwiuBDYiQDcBkYLUMWg9ItjxUxkJJA552S-SOUofMbkpGkNSap354GvCi90JgJDEJFH7eRWiwADC7U-wdZMzapxYlEYwwpDUhDyfSdVRZbHxlZPF22POqcJa4QihQoisY3m0_1_YJfaIE0pm8IGC0eVxTr7i0XJAD-x8Vh5zgLHlDJ86yZyzTEcidyBUQ_1lC2NSDH_-gnqbfTgNp_tIFhu'
    },

    milestone2: {
      year: '1924',
      event: '复杂功能的突破',
      desc: '首款具备万年历功能的腕表问世，打破了当时精密机械小型化的技术瓶颈。',
      descEn: 'Perpetual Calendar Breakthrough',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3ejAFSTdzrssBe5s8YVyDu3hkAT-s8Vr3xfc1yZWiWkndBIDIIKPmXad7ugg9XWYywukA7Bud7BJzCRAzDuJSNx1sYuU8SsqdIVbmKZRC43_JF1goojTXxhInpqm-4FSKeYlZ68QAZrkWd-l5K_m85pDBkdgqdKj2eqOjlINl2S3tLCcgeUnhGE5Lp5goB_fsmMagO6OT8J7p2gTbJJcDQi4BcqT8uNxRb9uK3ZQplZO5RQ7SsP31s1iw2DZME8OR3ZmDXXCO0S4y'
    },

    milestone3: {
      year: '2024',
      event: '致敬未来',
      desc: '融合钛金属材质与超薄机芯，CHRONOS 再次定义了现代奢华时计的标准。',
      descEn: 'Redefining Modern Luxury',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ixrp5BBTyvoDJQRZBbJ-K4esytXfCyJSb1XlBkVjD8RzwO1yry86Oo7phj6nhEEMb7LxWD5_DDKZovmblGrCrSd-msfUFCI1EN5wAEIEFjtthKw_V_8g9ON-cVwLuG-NS6jE0LkClMwJVu2qlVNi5G0IKi85kIE7AHy5j3cN_ob7zTUX2Wm-VOy3FhMol3AL1AJOFBPgElhsBZdYGP1C-4cNiFavr24D0-rCnSNnHb954PrgVBTFPJQFsCNZgWxlR2or5Fkpt2GC'
    },

    craft1: {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDniYFkDZiRcmxv1hW3sCJeAfcyBvDS0KVTy90-6SPc9dwgbkHKOWfBY0QFMWzJ4Za7zRxmBlQCuentk_g1kL7xX59kLgER9YoRmD2C3ikVMUTQyoldQBVysn8rE69ckad66lB_-E8o7fsQaRIkmdjWUlf6CgJMYeaRiXNUvYkHQUczcCjkb0V_EkloqVkn5Kq1jCKlRfl30K-LOknPCmGMo33muBTuEH3-yTjMiSCL1tpvSVbBdzFvWd-tQYzGdKkx1R23FsYlc9nE'
    },

    craft2: {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfopd7KbdPs6LGwFoHmw6Oe2nQXEtbGDjud-UvfEL4aRSFxUvLjbLx49oYS0p3Mw8F8tJbGXfiVXzzrmIZ4wLZEPlN98lQx7cpbutO9KGb6qbnfNcC9gSqUccq1plbP9DUCkUMevPZoCMC8Sn384QEV_O6bd6Xr7jz2qA_L27PAFdVGCDN21Obuq_iKTKPlMSDVN2VRFcST2zqdchu603JEq573k8fiIdxU4oUHJGvcaihEkTnWFhhKIfJwMB0hLI2CNM5h8WazdOL'
    },

    craft3: {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6Bsft28tS_ZxAPEUpzLpay73A9J0p-3egXEj6vfuxc-E5mhcKULKtowqF8HMMWUefBHfOAEOsnidemPuCw6sPnOCudkNK-7Bnz66sV0JbO6H8pMrgZJ0LtFa1MLhsk7kaufUG7AN6wz7DPoHYEMdsPcpSZMaInUb749XuPzCkayVZHm2pLVsl5puCNUxZPc1rHexZtUkvb4URqXofGhfLqSbo9g2_OMvIeA3cMh9BBef7n6ADQVErw7hUe1csCjApqacxfYFt6vTw'
    },

    craft4: {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVRhiYLj2Lc806dCivf7XcwkGkH2FGi0Z3XDJlKIT0IKDg7bgXQbo4dj1vv6PMJFH-hdhBeu0t__zSwaAz3LOjr1wTl_Pq_PUu6J0x94kEurvN7oMm_vFULCaFs4NekY_8K0jSXrh15G4XuTdFPlYE_PEwv-3LIZH3XJRlIdpCY9-8Z246lWP0jolM-v6GaHivGJ5LJEPyGSJm6s0hsNQ3C3GU36NZYJIRMZHNWzvJyViILAntonvbqfD6oEDLHacFYMlbb6XtwV2M'
    },

    collectionsImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVwDVPux-iCD3p3YclvgaqzfvuEO7CigGLwNYPj1JgJygTNMdHyw4HGbxDRdKsSJm7qALttgkx34ycPww5vbQWrZfoMeHxnfhf-DNPJakA64dA6UFrQXqGb2iO2NyGYsBu7f7za0C9q3qvCOyMfrvgZ2D9uDUDTsfxn4WSXvjzd50kqFG0y4OQsWjk1hyxTdxcAtGgP-g0AgJtjnUFBFYZ-vzMwkuaTCv04vmRIHSeODNU98GYwChDmOQfQl8rnvXCz4ypQFwxDTvr'
  },

  methods: {
    onDiscover() {
      wx.showModal({
        title: '探索更多',
        content: '即将推出更多精彩内容',
        confirmText: '确定'
      });
    },

    onExploreCollections() {
      wx.switchTab({
        url: '/pages/collections/collections'
      });
    }
  }
});
