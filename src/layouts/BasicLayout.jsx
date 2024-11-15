/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import React from 'react';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { DashboardOutlined } from '@ant-design/icons';
import { Link, connect, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import styles from '@/style/style.less';
import globalSettings from '@/fn/globalsettings';
import commFn from '@/fn/comm';
import projectInfo from '@/fn/projectInfo.json';
import { Fragment } from 'react';

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noMatch: false,
      hasError: false,
      viewLoading: false,
      selectedKey: '',
      pagePath: '',
      menuData: [],
      envText: '',
    };
  }

  goHome = () => {
    if (commFn.checkPlatOrEntRole() == '1') {
      history.push('/new_media');
    } else {
      history.push('/information/author');
    }
  }

  menuSelected = (path, hasReload) => {
    let newSelectedKey = '';
    let selectedList = [
      '/isrc',
      '/album',
      '/song',
      '/souvenir',
      '/misc',
      '/karaoke',
      '/information/author',
      '/information/company',
      '/new_media',
      '/enterprise/account',
      '/list/isrc_type',
      '/list/use_type',
      '/list/authorized_area',
      '/list/report_setting',
      '/setting/user',
      '/setting/member',
      '/setting/export_files',
      '/setting/department',
      '/setting/permission/manager',
      '/setting/permission/admin',
      '/contract/contract_song',
      '/contract/contract_author',
      '/settle/record/list',
      '/settle/right/list',
      // '/settle/right/album_prepaid',
      '/settle/right/newmedia/list',
      '/settle/right/newmedia',
      '/settle/record/newmedia',
      '/settle/exchange_rate/list',
    ];

    if (path) {
      for (let i = 0; i < selectedList.length; i++) {
        if (path.indexOf(selectedList[i]) == 0) {
          newSelectedKey = selectedList[i];
          break;
        }
      }
    }

    if (hasReload) {
      if (newSelectedKey && newSelectedKey != path) {
        window.location.href = `${REACT_APP_PUBLIC_PATH}/?t=${commFn.randomNum()}/#${newSelectedKey}`;
      } else {
        window.location.href = `${REACT_APP_PUBLIC_PATH}/?t=${commFn.randomNum()}`;
      }
    } else {
      this.setState({
        selectedKey: newSelectedKey,
        pagePath: this.props.location.pathname,
      });

      if (path == '/') {
        this.goHome();
      }
    }
  }

  clickMenu(newPath) {
    if (this.state.hasError) {
      window.location.href = `${REACT_APP_PUBLIC_PATH}/?t=${commFn.randomNum()}/#${newPath}`;
    }
  }

  checkFn(init) {
    const { dispatch } = this.props;

    commFn.checkUiVersion(projectInfo.version, this.props.location.pathname).then(() => {
      return commFn.checkLogin();
    }).then(() => {
      // checkEnvFile
      if (init) {
        return commFn.checkEnvFile(true);
      } else {
        return true;
      }
    }).then((envResult) => {
      // envResult
      if (init && envResult) {
        this.setState({
          envText: envResult,
        });
      }

      // getuserdata
      if (init) {
        dispatch({
          type: 'authList/fetchGetInitUserData',
        });
      }

      // TODO: checkLanguage
      return commFn.initForCheckLanguage();
    }).then(() => {
      if (init) {
        // ONLY FOR TEST
        if (commFn.checkPlatOrEntRole() == '1') {
          // get companys
          dispatch({
            type: 'enterpriseList/fetchGetListAll',
          });

          // set menu
          this.setState({
            menuData: [
              // new_media -----
              {
                path: '/new_media',
                name: '新媒體',
                icon: <DashboardOutlined />,
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
                icon: <DashboardOutlined />,
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
                icon: <DashboardOutlined />,
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
                ]
              },
              // core_management -----
              /*
              {
                path: '/core_management',
                name: '系統管理',
                icon: <DashboardOutlined />,
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
              // 404 -----
              {
                component: '404',
              },
            ]
          });
        } else {
          this.setState({
            menuData: [
              // song -----
              {
                path: '/song',
                name: '歌曲',
                icon: <DashboardOutlined />,
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
              {
                path: '/song/rights/transfer/id/:id/song_code/:song_code',
                component: './song/rights/transfer/[id]',
              },
              // contract -----
              {
                path: '/contract',
                name: '合約',
                icon: <DashboardOutlined />,
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
                icon: <DashboardOutlined />,
                component: './isrc/basic'
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
                icon: <DashboardOutlined />,
                component: './album/basic'
              },
              {
                path: '/album/adv/:id',
                component: './album/adv/[id]'
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
                icon: <DashboardOutlined />,
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
                icon: <DashboardOutlined />,
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
                icon: <DashboardOutlined />,
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
                icon: <DashboardOutlined />,
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
              {
                path: '/setting',
                name: '設定',
                icon: <DashboardOutlined />,
                routes: [
                  /*
                  {
                    path: '/setting/member',
                    name: '成員管理',
                    icon: '',
                    component: './setting/member',
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
                    path: '/setting/member/add',
                    component: './setting/member/add',
                  },
                  {
                    path: '/setting/member/add_finish/:id',
                    component: './setting/member/add_finish/[id]',
                  },
                  */
                  {
                    path: '/setting/export_files',
                    name: '匯出',
                    icon: '',
                    component: './setting/export_files',
                  },
                ]
              },
            ]
          });
        }
        return true;
      }

      return true;
    }).then(() => {
      // ONLY FOR TEST - 動態 MENU 與 PERMISSION - check permission
      if (commFn.checkPlatOrEntRole() == '2') {
        let list = [
          '/account',
          '/account/update',
          '/song',
          '/song/adv/id/:id',
          '/song/adv/song_code/:id',
          '/song/update',
          '/song/update/:id',
          '/song/rights/update/id/:id/song_code/:song_code',
          '/song/rights/update/song_code/:song_code',
          '/song/rights/transfer/id/:id/song_code/:song_code',
          '/contract/contract_song',
          '/contract/contract_song/adv/id/:id',
          '/contract/contract_song/update',
          '/contract/contract_song/update/:id',
          // '/contract/contract_song/transfer/:id',
          '/contract/contract_song/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id',
          '/contract/contract_song/prepaid/update/contract_id/:contract_id',
          '/contract/contract_song/prepaid/update/contract_id/:contract_id/prepaid_id/:prepaid_id',
          '/contract/contract_author',
          '/contract/contract_author/adv/:id',
          '/contract/contract_author/update',
          '/contract/contract_author/update/:id',
          '/contract/contract_author/prepaid/contract_id/:contract_id',
          '/contract/contract_author/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id',
          '/isrc',
          '/isrc/adv/:id',
          '/isrc/update',
          '/isrc/update/id/:id',
          '/isrc/update/song_code/:song_code',
          '/album',
          '/album/adv/:id',
          '/album/update',
          '/album/update/:id',
          '/album/update/copy/:id',
          '/album/song_seq/id/:id',
          '/album/song_seq/id/:id/disc_id/:disc_id',
          '/album/prepaid/album_id/:id/disc_content_id/:disc_content_id',
          '/album/rights/:id',
          '/information/author',
          '/information/author/adv/:id/info',
          '/information/author/adv/:id/isrc',
          '/information/author/adv/:id/contract_author',
          '/information/author/adv/:id/contract_song',
          '/information/author/adv/:id/song_rights',
          '/information/author/update',
          '/information/author/update/:id',
          '/information/company',
          '/information/company/adv/:id/info',
          '/information/company/adv/:id/contract_author',
          '/information/company/adv/:id/contract_song',
          '/information/company/update',
          '/information/company/update/:id',
          '/information/company/adv/:id/replace_settlement',
          '/souvenir',
          '/souvenir/update',
          '/souvenir/update/:id',
          '/misc',
          '/misc/adv/:id',
          '/misc/update',
          '/misc/update/:id',
          '/karaoke',
          '/karaoke/adv/:id',
          '/karaoke/update',
          '/karaoke/update/:id',
          '/karaoke/update/copy/:id',
          '/test',
          // '/setting/member',
          // '/setting/member/adv/id/:id',
          // '/setting/member/update/:id',
          // '/setting/member/add',
          // '/setting/member/add_finish/:id',
          '/setting/export_files',
        ];

        if (!commFn.checkUIRoute(list, this.props.location.pathname)) {
          this.setState({
            noMatch: true,
          });
          this.menuSelected('');
        } else {
          if (this.state.noMatch != false) {
            this.setState({
              noMatch: false,
            });
          }
          this.menuSelected(this.props.location.pathname);
        }
      } else {
        this.menuSelected(this.props.location.pathname);
      }
    }).catch((result) => {
      if (result && result == 'logout') {
        commFn.logout();
      }
    });
  }

  handleMenuCollapse = payload => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  componentDidMount() {
    const base = this;

    base.checkFn(true);

    // checkTimer
    base.checkTimer = setInterval(() => {
      // checkLogin
      if (!commFn.isLogin()) {
        commFn.logout();
      }

      // checkEnvFile
      commFn.checkEnvFile(false, this.state.envText).then((envResult) => {
        if (envResult) {
          this.setState({
            envText: envResult,
          });
        }
      }).catch(() => { });
    }, globalSettings.envTimer);
  }

  componentDidUpdate(prevProps) {
    const { authList } = this.props;
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.checkFn(false);
    }
  }

  componentWillUnmount() {
    // checkTimer
    clearTimeout(this.checkTimer);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError, noMatch, viewLoading, selectedKey, pagePath, menuData } = this.state;
    const {
      dispatch,
      children,
      settings,
      location = {
        pathname: '/',
      },
      uirouteList,
      authList,
      enterpriseList,
    } = this.props;
    const props = this.props;

    return (<>
      <ProLayout
        title={
          `Music5 ${(commFn.checkPlatOrEntRole() == '1') ? '後台版' : '企業版'}`}
        className={styles.leftHeaderLogo}
        selectedKeys={[selectedKey]}
        loading={viewLoading}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">{titleDom}</Link>
        )}
        onCollapse={this.handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path} onClick={() => { this.clickMenu(menuItemProps.path); }}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) =>
          (Object.prototype.toString.call(routers) === '[object Array]' && [
            {
              path: '/',
              breadcrumbName: '首頁',
            },
            ...routers,
          ]) ||
          []
        }
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: '/',
        //     breadcrumbName: '首頁',
        //   },
        //   ...routers,
        // ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => <DefaultFooter copyright="相信音樂" links={[]} />}
        menuDataRender={(menuList) => {
          // TODO: 動態 MENU 與 PERMISSION - 動態生成 menu，應拉 function 出來，需增加 init 判斷動態載入
          /*
          return menuList.filter((elem) => {
            let hasElem = false;
            for (let i = 0; i < uirouteList.initMenu.menu_list.length; i++) {
              if (elem.path == uirouteList.initMenu.menu_list[i]) {
                hasElem = true;
                break;
              }
            }
            return hasElem;
          });
          */

          return menuData;
        }}
        rightContentRender={() => <RightContent isPath={this.props.location.pathname} />}
        {...props}
        {...settings}
      >
        {
          (hasError)
            ? (
              <Result
                status="error"
                title="程式發生錯誤，請按下方按鈕「重新整理」，或與廠商聯繫"
                extra={[
                  <Button type="primary" onClick={() => {
                    let newMenu = this.menuSelected(this.props.location.pathname, true);
                  }}>
                    重新整理
                   </Button>
                ]}
              />
            )
            : (
              (pagePath == props.location.pathname && enterpriseList && enterpriseList.agent_eid)
                ? (
                  (noMatch)
                    ? (
                      <Result
                        status={403}
                        title="403"
                        subTitle="抱歉，您的權限不足"
                      // extra={
                      //   <Button type="primary">
                      //     <Link to="/#">Go Login</Link>
                      //   </Button>
                      // }
                      />
                    )
                    : (children)
                )
                : ('Loading...')
            )
        }
      </ProLayout>
    </>
    );
  }
};

export default connect(({ global, uirouteList, settings, authList, enterpriseList }) => ({
  collapsed: global.collapsed,
  uirouteList,
  settings,
  authList,
  enterpriseList,
}))(BasicLayout);