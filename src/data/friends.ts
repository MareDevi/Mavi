export interface FriendLink {
  name: string;
  url: string;
  description: string;
  avatar?: string;
  tags?: string[];
  featured?: boolean;
}

export const friendLinks: FriendLink[] = [
  {
    name: "BlogOfJunPickle",
    url: "https://junpickle.github.io/",
    description: "深海是沉默的基地,我是团结的屁股_",
    avatar: "https://junpickle.github.io/img/OC.png",
  },
  {
    name: "PopHirasawa's Blog",
    url: "https://pophirasawa.top",
    description: "循此苦旅，直抵群星。",
    avatar: "https://avatars.githubusercontent.com/u/81603561?v=41",
  },
  {
    name: 'Ruri 的博客',
    url: 'https://blog.meltyland.dev',
    description: '这里是流离的个人博客。',
    avatar: 'https://avatars.githubusercontent.com/u/88608708',
  },
  {
    name: 'BIGSK 的博客',
    url: 'https://blog.ianxia.com/',
    description: 'Codice est quasi poem a.',
    avatar: 'https://2-cdn.ianxia.com/images/avatar/common.png',

  },
  {
    name: 'Yume Shoka',
    url: 'https://shoka.lostyu.me/',
    description: '琉璃的医学 & 编程笔记',
    avatar: 'https://shoka.lostyu.me/images/avatar.jpg',
  },
  {
    name: '字节君的博客',
    url: 'https://blog.lvbyte.top/',
    description: '热爱漫无边际，生活自有分寸。',
    avatar: 'https://npm.elemecdn.com/lvbyte-cdn/20230104/%E8%8B%B9%E6%9E%9C.156l7bksen40.jpg',
  },
  {
    name: 'まほ的角落',
    url: 'https://blog.ry.mk/',
    description: '在這世界 (更多一些) 的角落。',
    avatar: 'https://blog.ry.mk/assets/avatar.webp',
  },
  {
    name: "Soulter's Blog",
    url: 'https://blog.soulter.top',
    avatar: "https://avatars.githubusercontent.com/u/37870767?v=4",
    description: 'The world is your canvas!'
  }
  //   {
  //     name: "MareDevi",
  //     url: "https://www.maredevi.moe",
  //     description: "本站点的主人，记录日常、开发与读书札记。",
  //     tags: ["Blog", "Notes"],
  //     featured: true,
  //   }
];
