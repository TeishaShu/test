export default {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: 'Music 5 後台',
  pwa: false,
  iconfontUrl: '',
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        // AuthLayout ----- -----
        {
          path: '/auth',
          component: '../layouts/AuthLayout',
          routes: [
            // login -----
            {
              path: '/auth/login',
              component: './auth/login',
            },
            // forgot password -----
            {
              path: '/auth/forgot_password',
              component: './auth/forgot_password',
            },
            {
              redirect: '/auth/login'
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout',
          routes: [
            // AuthAccessLayout (need login) ----- -----
            {
              path: '/authaccess',
              component: '../layouts/AuthAccessLayout',
              routes: [
                // change password -----
                {
                  path: '/authaccess/change_password',
                  component: './auth/change_password',
                },
                // 新增企業帳號頁面
                {
                  path: '/authaccess/enterprise/account/add',
                  component: './enterprise/account/add',
                },
                // 企業帳號新增完成跳轉頁
                {
                  path: '/authaccess/enterprise/account/add_finish/:id',
                  component: './enterprise/account/add_finish/[id]',
                },
                // 新增成員帳號頁面
                {
                  path: '/authaccess/setting/member/add',
                  component: './setting/member/add',
                },
                // 成員帳號新增完成跳轉頁
                {
                  path: '/authaccess/setting/member/add_finish/:id',
                  component: './setting/member/add_finish/[id]',
                },
                {
                  redirect: '/auth/login',
                },
              ],
            },
            // BasicLayout (need login) ----- -----
            {
              path: '/',
              component: '../layouts/BasicLayout',
              routes: [
                // account -----
                {
                  path: '/account',
                  component: './account/basic',
                },
                {
                  path: '/account/update',
                  component: './account/update',
                },
                // song -----
                {
                  path: '/song',
                  name: '歌曲',
                  icon: 'dashboard',
                  component: './song/basic',
                },
                {
                  path: '/song/adv/id/:id',
                  component: './song/adv/[id]',
                },
                {
                  path: '/song/adv/song_code/:id',
                  component: './song/adv/[id]',
                },
                {
                  path: '/song/update',
                  component: './song/update/[id]',
                },
                {
                  path: '/song/update/:id',
                  component: './song/update/[id]',
                },
                // song right - edit
                {
                  path: '/song/rights/update/id/:id/song_code/:song_code',
                  component: './song/rights/update/[id]',
                },
                // song right - add
                {
                  path: '/song/rights/update/song_code/:song_code',
                  component: './song/rights/update/[id]',
                },
                // song right - transfer
                // {
                //   path: '/song/rights/transfer/id/:id/song_code/:song_code',
                //   component: './song/rights/transfer/[id]',
                // },
                // contract -----
                {
                  path: '/contract',
                  name: '合約',
                  icon: 'dashboard',
                  routes: [
                    {
                      path: '/contract/contract_song',
                      name: '詞曲合約',
                      component: './contract/contract_song/basic',
                    },
                    {
                      path: '/contract/contract_song/adv/id/:id',
                      component: './contract/contract_song/adv/[id]',
                    },
                    {
                      path: '/contract/contract_song/update',
                      component: './contract/contract_song/update/[id]',
                    },
                    {
                      path: '/contract/contract_song/update/:id',
                      component: './contract/contract_song/update/[id]',
                    },
                    // {
                    //   path: '/contract/contract_song/transfer/:id',
                    //   component: './contract/contract_song/transfer/[id]',
                    // },
                    {
                      path: '/contract/contract_song/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id',
                      component: './contract/contract_song/prepaid/basic/[id]',
                    },
                    {
                      path: '/contract/contract_song/prepaid/update/contract_id/:contract_id',
                      component: './contract/contract_song/prepaid/update/[id]',
                    },
                    {
                      path: '/contract/contract_song/prepaid/update/contract_id/:contract_id/prepaid_id/:prepaid_id',
                      component: './contract/contract_song/prepaid/update/[id]',
                    },
                    {
                      path: '/contract/contract_author',
                      name: '藝人發行合約',
                      component: './contract/contract_author/basic',
                    },
                    {
                      path: '/contract/contract_author/adv/:id',
                      component: './contract/contract_author/adv/[id]',
                    },
                    {
                      path: '/contract/contract_author/update',
                      component: './contract/contract_author/update/[id]',
                    },
                    {
                      path: '/contract/contract_author/update/:id',
                      component: './contract/contract_author/update/[id]',
                    },
                    {
                      path: '/contract/contract_author/prepaid/contract_id/:contract_id',
                      component: './contract/contract_author/prepaid/[id]',
                    },
                    {
                      path: '/contract/contract_author/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id',
                      component: './contract/contract_author/prepaid/[id]',
                    },
                  ],
                },
                // isrc -----
                {
                  path: '/isrc',
                  name: 'ISRC',
                  icon: 'dashboard',
                  component: './isrc/basic',
                },
                {
                  path: '/isrc/adv/:id',
                  component: './isrc/adv/[id]',
                },
                {
                  path: '/isrc/update',
                  component: './isrc/update/[id]',
                },
                {
                  path: '/isrc/update/id/:id',
                  component: './isrc/update/[id]',
                },
                {
                  path: '/isrc/update/song_code/:song_code',
                  component: './isrc/update/[id]',
                },
                // album
                {
                  path: '/album',
                  name: '專輯',
                  icon: 'dashboard',
                  component: './album/basic',
                },
                {
                  path: '/album/adv/:id',
                  component: './album/adv/[id]',
                },
                {
                  path: '/album/update',
                  component: './album/update/[id]',
                },
                {
                  path: '/album/update/:id',
                  component: './album/update/[id]',
                },
                {
                  path: '/album/update/copy/:id',
                  component: './album/update/[id]',
                },
                {
                  path: '/album/song_seq/id/:id',
                  component: './album/song_seq/[id]'
                },
                {
                  path: '/album/song_seq/id/:id/disc_id/:disc_id',
                  component: './album/song_seq/[id]'
                },
                {
                  path: '/album/prepaid/album_id/:id/disc_content_id/:disc_content_id',
                  component: './album/prepaid/[id]'
                },
                {
                  path: '/album/rights/:id',
                  component: './album/rights/[id]'
                },
                // souvenir -----
                {
                  path: '/souvenir',
                  name: '明星商品',
                  icon: 'dashboard',
                  component: './souvenir/basic',
                },
                {
                  path: '/souvenir/update',
                  component: './souvenir/update/[id]',
                },
                {
                  path: '/souvenir/update/:id',
                  component: './souvenir/update/[id]',
                },
                // misc -----
                {
                  path: '/misc',
                  name: '其他授權',
                  icon: 'dashboard',
                  component: './misc/basic',
                },
                {
                  path: '/misc/adv/:id',
                  component: './misc/adv/[id]',
                },
                {
                  path: '/misc/update',
                  component: './misc/update/[id]',
                },
                {
                  path: '/misc/update/:id',
                  component: './misc/update/[id]',
                },
                // karaoke -----
                {
                  path: '/karaoke',
                  name: '卡拉 OK',
                  icon: 'dashboard',
                  component: './karaoke/basic',
                },
                {
                  path: '/karaoke/adv/:id',
                  component: './karaoke/adv/[id]',
                },
                {
                  path: '/karaoke/update',
                  component: './karaoke/update/[id]',
                },
                {
                  path: '/karaoke/update/:id',
                  component: './karaoke/update/[id]',
                },
                {
                  path: '/karaoke/update/copy/:id',
                  component: './karaoke/update/[id]',
                },
                // information -----
                {
                  path: '/information',
                  name: '基本資料',
                  icon: 'dashboard',
                  routes: [
                    // author -----
                    {
                      path: '/information/author',
                      name: '藝人/作者',
                      icon: '',
                      component: './information/author/basic',
                    },
                    {
                      path: '/information/author/adv/:id/info',
                      component: './information/author/adv/[id]',
                    },
                    {
                      path: '/information/author/adv/:id/isrc',
                      component: './information/author/adv/[id]',
                    },
                    {
                      path: '/information/author/adv/:id/contract_author',
                      component: './information/author/adv/[id]',
                    },
                    {
                      path: '/information/author/adv/:id/contract_song',
                      component: './information/author/adv/[id]',
                    },
                    {
                      path: '/information/author/adv/:id/song_rights',
                      component: './information/author/adv/[id]',
                    },
                    {
                      path: '/information/author/update',
                      component: './information/author/update/[id]',
                    },
                    {
                      path: '/information/author/update/:id',
                      component: './information/author/update/[id]',
                    },
                    // company -----
                    {
                      path: '/information/company',
                      name: '公司',
                      icon: '',
                      component: './information/company/basic',
                    },
                    {
                      path: '/information/company/adv/:id/info',
                      component: './information/company/adv/[id]',
                    },
                    {
                      path: '/information/company/adv/:id/contract_author',
                      component: './information/company/adv/[id]',
                    },
                    {
                      path: '/information/company/adv/:id/contract_song',
                      component: './information/company/adv/[id]',
                    },
                    {
                      path: '/information/company/update',
                      component: './information/company/update/[id]',
                    },
                    {
                      path: '/information/company/update/:id',
                      component: './information/company/update/[id]',
                    },
                    {
                      path: '/information/company/adv/:id/replace_settlement',
                      component: './information/company/adv/replace_settlement/[id]',
                    },
                    // 404 -----
                    {
                      component: '404',
                    },
                  ],
                },
                // enterprise -----
                {
                  path: '/enterprise',
                  name: '企業帳號設定',
                  icon: 'dashboard',
                  routes: [
                    {
                      path: '/enterprise/account',
                      name: '企業帳號管理',
                      component: './enterprise/account/basic',
                    },
                    {
                      path: '/enterprise/account/adv/id/:id',
                      component: './enterprise/account/adv/[id]',
                    },
                    {
                      path: '/enterprise/account/update/:id',
                      component: './enterprise/account/update/[id]',
                    },
                    {
                      path: '/enterprise/info',
                      name: '企業資料',
                      component: './enterprise/info/basic',
                    },
                    {
                      path: '/enterprise/info/update',
                      component: './enterprise/info/update/[id]',
                    },
                    {
                      path: '/enterprise/info/update/:id',
                      component: './enterprise/info/update/[id]',
                    },
                    {
                      path: '/enterprise/info/adv/id/:id',
                      component: './enterprise/info/adv/[id]',
                    },
                  ],
                },
                // new_media -----
                {
                  path: '/new_media',
                  name: '新媒體',
                  icon: 'dashboard',
                  component: './new_media',
                },
                {
                  path: '/new_media/:id/song_media',
                  component: './new_media',
                },
                {
                  path: '/new_media/:id/import_song_media',
                  component: './new_media',
                },
                // settle -----
                {
                  path: '/settle',
                  name: '結算',
                  icon: 'dashboard',
                  routes: [
                    {
                      path: '/settle/right',
                      name: '詞曲結算',
                      icon: '',
                      routes: [
                        {
                          name: '詞曲結算',
                          path: '/settle/right/list',
                          component: './settle/right/list'
                        },
                        {
                          path: '/settle/right/list/album_tw/:id',
                          component: './settle/right/list/album_tw/[id]'
                        },
                        {
                          path: '/settle/right/list/album_ext/:id',
                          component: './settle/right/list/album_ext/[id]'
                        },
                        {
                          path: '/settle/right/list/album_os/:id',
                          component: './settle/right/list/album_os/[id]'
                        },
                        {
                          path: '/settle/right/list/album_exception/:id',
                          component: './settle/right/list/album_exception/[id]'
                        },
                        {
                          path: '/settle/right/list/misc/:id',
                          component: './settle/right/list/misc/[id]'
                        },
                        /*
                        {
                          name: '專輯詞曲預付',
                          path: '/settle/right/album_prepaid',
                          component: './settle/right/album_prepaid',
                        },
                        */
                        {
                          path: '/settle/right/list/cal_preview/:id',
                          component: './settle/right/list/cal_preview/[id]'
                        },
                        {
                          name: '詞曲預付扣抵餘額',
                          path: '/settle/right/get_album_prepaid',
                          component: './settle/right/get_album_prepaid'
                        },
                        {
                          name: '本期專輯預付',
                          path: '/settle/right/get_now_album_prepaid',
                          component: './settle/right/get_album_prepaid'
                        },
                        {
                          name: '新媒體清單',
                          path: '/settle/right/newmedia',
                          component: './settle/right/newmedia'
                        },
                        /*
                        {
                          name: '新媒體清單',
                          path: '/settle/right/newmedia',
                          component: './settle/right/newmedia/list'
                        },
                        {
                          path: '/settle/right/newmedia/song_match/:id',
                          component: './settle/right/newmedia/song_match/[id]'
                        }
                        */
                      ]
                    },
                    {
                      path: '/settle/record',
                      name: '錄音結算',
                      icon: '',
                      routes: [
                        {
                          name: '錄音結算',
                          path: '/settle/record/list',
                          component: './settle/record/list'
                        },
                        {
                          path: '/settle/record/list/album_tw/:id',
                          component: './settle/record/list/album_tw/[id]'
                        },
                        {
                          path: '/settle/record/list/album_ext/:id',
                          component: './settle/record/list/album_ext/[id]'
                        },
                        {
                          path: '/settle/record/list/album_os/:id',
                          component: './settle/record/list/album_os/[id]'
                        },
                        {
                          path: '/settle/record/list/cal_preview/recphase/:id/souphase/:souvid',
                          component: './settle/record/list/cal_preview/[id]'
                        },
                        {
                          name: '新媒體清單',
                          path: '/settle/record/newmedia',
                          component: './settle/record/newmedia'
                        },
                        {
                          path: '/settle/record/list/settle_souvenir/:id/file_list/:file_list',
                          component: './settle/record/list/settle_souvenir/[id]'
                        },
                        {
                          path: '/settle/record/list/misc/:id',
                          component: './settle/record/list/misc/[id]'
                        },
                      ]
                    },
                    {
                      path: '/settle/exchange_rate',
                      name: '匯率表',
                      icon: '',
                      routes: [
                        {
                          name: '一般通用',
                          path: '/settle/exchange_rate/list',
                          icon: '',
                          component: './settle/exchange_rate/list'
                        },
                        {
                          name: 'Apple(美金)',
                          path: '/settle/exchange_rate/apple',
                          icon: '',
                          component: './settle/exchange_rate/apple'
                        },
                      ]
                    },
                  ]
                },
                // list -----
                {
                  path: '/list',
                  name: '選單設定',
                  icon: 'dashboard',
                  routes: [
                    // isrc_type -----
                    {
                      path: '/list/isrc_type',
                      name: 'ISRC型態',
                      icon: '',
                      component: './list/isrc_type',
                    },
                    // use_type -----
                    {
                      path: '/list/use_type',
                      name: '使用型態',
                      icon: '',
                      component: './list/use_type',
                    },
                    // authorized_area -----
                    {
                      path: '/list/authorized_area',
                      name: '授權地區',
                      icon: '',
                      component: './list/authorized_area',
                    },
                    // report_setting -----
                    {
                      path: '/list/report_setting',
                      name: '報表設定',
                      icon: '',
                      component: './list/report_setting',
                    },
                    // 404 -----
                    {
                      component: '404',
                    },
                  ],
                },
                // setting old ----- 可能整個換掉，需求更改
                /*
                {
                  path: '/setting',
                  name: '設定',
                  icon: 'dashboard',
                  routes: [
                    // user
                    {
                      path: '/setting/user',
                      name: '人員管理',
                      icon: '',
                      component: './setting/user',
                    },
                    // member
                    {
                      path: '/setting/department',
                      name: '部門管理',
                      icon: '',
                      component: './setting/department',
                    },
                    // manager permission
                    {
                      path: '/setting/permission/manager',
                      name: '權限設定',
                      icon: '',
                      component: './setting/permission/manager/basic/[id]',
                    },
                    {
                      path: '/setting/permission/manager/:id',
                      component: './setting/permission/manager/basic/[id]',
                    },
                    {
                      path: '/setting/permission/manager/update/member_id/:id',
                      component: './setting/permission/manager/update/[id]',
                    },
                    // admin permission
                    {
                      path: '/setting/permission/admin/new_user',
                      name: '權限設定',
                      icon: '',
                      component: './setting/permission/admin/basic/[id]',
                    },
                    {
                      path: '/setting/permission/admin/department',
                      component: './setting/permission/admin/basic/[id]',
                    },
                    {
                      path: '/setting/permission/admin/department/:id',
                      component: './setting/permission/admin/basic/[id]',
                    },
                    {
                      path: '/setting/permission/admin/update',
                      redirect: '/setting/permission/admin/new_user',
                    },
                    {
                      path: '/setting/permission/admin/update/:id',
                      component: './setting/permission/admin/update/[id]',
                    },
                  ],
                },
                */
                // setting (enterprise) -----
                {
                  path: '/setting',
                  name: '設定',
                  icon: 'dashboard',
                  routes: [
                    {
                      path: '/setting/member',
                      name: '成員管理',
                      icon: '',
                      component: './setting/member/basic',
                    },
                    {
                      path: '/setting/member/adv/id/:id',
                      component: './setting/member/adv/[id]',
                    },
                    {
                      path: '/setting/member/update/:id',
                      component: './setting/member/update/[id]',
                    },
                    {
                      path: '/setting/export_files',
                      name: '匯出',
                      icon: '',
                      component: './setting/export_files',
                    },
                  ],
                },
                // core_management -----
                {
                  path: '/core_management/ui_route',
                  component: './core_management/ui_route/update',
                },
                {
                  path: '/core_management/ui_route/change_order',
                  component: './core_management/ui_route/change_order',
                },
                /*
                {
                  path: '/core_management',
                  name: '系統管理',
                  icon: 'dashboard',
                  routes: [
                    // uiroute -----
                    {
                      path: '/core_management/ui_route',
                      name: 'UI 路由',
                      icon: '',
                      component: './core_management/ui_route/update',
                    },
                    {
                      path: '/core_management/ui_route/change_order',
                      component: './core_management/ui_route/change_order',
                    },
                    // 404 -----
                    {
                      component: '404',
                    },
                  ],
                },
                */
                // test -----
                {
                  path: '/test',
                  component: './test',
                },
                // ui_info -----
                {
                  path: '/ui_info',
                  component: './ui_info',
                },
                // error -----
                {
                  component: '404',
                },
              ],
            },
          ]
        },
      ],
    },
  ],
};
