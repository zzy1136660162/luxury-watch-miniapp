Component({
  data: {
    currentTab: 'classic',
    memberPoints: '12,800',

    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA5WFOhJ_VIWVkNF0wBHG1a6JTFnU_-8rAV1THqo9vf7SwdNmciHPu7bXoQe1Nj7cyC4ORrvf1rqHXlRNl5b-2UwLqcjDQCfbv6ucOr3sbYviVNnEJpMG2m5867nbhAVvlE1OEXYH15M6VxRr5mkjEg5oLYETztXJ-OhvuoKqkZh6STpUbgBu7B8NC81b62xd0pFvbHWvPvz8VXJRyU-FhTOIrKrZxXT2Lsuw-Ss7_nudNbzOq_oStwt4fxwDCRpE-0rHPETsLctuk',

    featuredProduct: {
      id: 'featured1',
      tag: 'ACCESSORIES',
      title: '高级鳄鱼皮表带',
      desc: '甄选密西西比鳄鱼腹皮，纯手工缝制，呈现无与伦比的质感与耐用性。',
      points: '8,000',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClsdId8RG5mmYTHbnpgt8goM4PavcBFnAjyBtcrlk7-G_HX-S8a60jq_NO6hW3hPEtJ8Xms75yAuuyhGZIyFLMzJiXO5SzOlHwBzAC4cJr2VYE8YBADgHjSmr9lIT_al31kD-uxIMp8nYla36PV0DzXFWm1odvtXWRfCl4-fT0R82R1cNWL57-oK_cNO5HMGLYnNowM3m0i9FhTQA7UbvdkORjm0k6GtObjhDFrOlOfKAhpNYjfmPvKj2IkPDYAJ4K8OB0wPYKSmG4'
    },

    silkScarf: {
      id: 'silk1',
      tag: 'LIMITED EDITION',
      title: '周年限量丝巾',
      desc: '与先锋艺术家联名创作，将时间的律动化为指尖的丝滑艺术。',
      points: '5,000',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH9iGz1xnyeaGTHPHBMCnrVXwS-VXAsFV3zE0yYT9kUu1UxgOLeYszmitf7TDdgMC5k87OpC9EyzUcJWKWk9lt3IJUk6QW_o9N5HdLAuPXV1ESLKAZXMmceBsR4-sNYGu5Hjy90WOAeEr8RiVTnMt8IRvPwjHyFoyZnCGnVoBdzapcyQzX7YeT1PVYrsjnoJJhZ9En6qOuHIRUvsYJSnBpjFg0ugQS927rtdIWu6lRpg99J8tihtvXm7lUqW_oChgaXUfqN5vFSADI'
    },

    privateEvent: {
      id: 'event1',
      tag: 'OFFLINE EXPERIENCE',
      title: '私人品鉴会邀请函',
      desc: '亲临品牌年度私密晚宴，与制表大师面对面交流，探索未公开的传世新作。',
      points: '12,000',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_QmZ8WotfMzaevyckveu45OZR404vuqFaN9-4J4R7stJXFXVZSb-wIY1rKF9qkPhzNE64H8NWcqtQ2My0CFDgktbgUzTuINW0HMB3AsgNeW9rlS70YLVeiG-DWSQ_ZxBKOOVAiiEU5xt1AYSxkFPQVOdhJg6sG10Sg5F4oPDKm400b9LALZ3y4oSDG6akBjeeUcCRssb-2JCAuDafQ2o8BtuvrPCpWt6AHLzPH26XA6l1loKsN5TwK1bT76T_AYWIw9tGVnImhS1b'
    }
  },

  methods: {
    onTabTap(e: any) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({
        currentTab: tab
      });
    },

    onProductTap(e: any) {
      const productId = e.currentTarget.dataset.id;
      wx.showModal({
        title: '商品详情',
        content: `商品ID: ${productId}`,
        confirmText: '确定'
      });
    },

    onRedeem(e: any) {
      const productId = e.currentTarget.dataset.id;
      wx.showModal({
        title: '兑换确认',
        content: '确定要兑换此商品吗？',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '兑换成功',
              icon: 'success'
            });
          }
        }
      });
    }
  }
});
