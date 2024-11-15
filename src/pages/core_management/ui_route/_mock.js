function getInitMenu(req, res) {
  const result = {
    "data": {
      "menu": [
        {
          "id": "6",
          "function_id": "46",
          "path": "/account",
          "name": null,
          "component": "component",
          "setting_order": "6",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "118",
          "function_id": "46",
          "path": "/account/update",
          "name": null,
          "component": "./account/update",
          "setting_order": "7",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "7",
          "function_id": "4",
          "path": "/song",
          "name": "歌曲",
          "component": "./song/basic",
          "setting_order": "8",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "8",
          "function_id": "4",
          "path": "/song/adv/id/:id",
          "name": null,
          "component": "./song/adv/[id]",
          "setting_order": "9",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "9",
          "function_id": "4",
          "path": "/song/adv/song_code/:id",
          "name": null,
          "component": "./song/adv/[id]",
          "setting_order": "10",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "10",
          "function_id": "5",
          "path": "/song/update",
          "name": null,
          "component": null,
          "setting_order": "11",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "11",
          "function_id": "5",
          "path": "/song/update/:id",
          "name": null,
          "component": "./song/update/[id]",
          "setting_order": "12",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "12",
          "function_id": "7",
          "path": "/song/rights/update/id/:id/song_code/:song_code",
          "name": null,
          "component": "./song/rights/update/[id]",
          "setting_order": "13",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "13",
          "function_id": "7",
          "path": "/song/rights/update/song_code/:song_code",
          "name": null,
          "component": "./song/rights/update/[id]",
          "setting_order": "14",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "14",
          "function_id": "14",
          "path": "/song/rights/transfer/id/:id/song_code/:song_code",
          "name": null,
          "component": "./song/rights/transfer/[id]",
          "setting_order": "15",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "15",
          "function_id": null,
          "path": "/contract",
          "name": "合約",
          "component": null,
          "setting_order": "16",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3",
          "routes": [
            {
              "id": "16",
              "function_id": "13",
              "path": "/contract/contract_song",
              "name": "詞曲合約",
              "component": "./contract/contract_song/basic",
              "setting_order": "17",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "17",
              "function_id": "13",
              "path": "/contract/contract_song/adv/id/:id",
              "name": null,
              "component": "./contract/contract_song/adv/[id]",
              "setting_order": "18",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "18",
              "function_id": "14",
              "path": "/contract/contract_song/update",
              "name": null,
              "component": null,
              "setting_order": "19",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "19",
              "function_id": "14",
              "path": "/contract/contract_song/update/:id",
              "name": null,
              "component": "./contract/contract_song/update/[id]",
              "setting_order": "20",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "20",
              "function_id": "14",
              "path": "/contract/contract_song/transfer/:id",
              "name": null,
              "component": "./contract/contract_song/transfer/[id]",
              "setting_order": "21",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "21",
              "function_id": "16",
              "path": "/contract/contract_song/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id",
              "name": null,
              "component": "./contract/contract_song/prepaid/basic/[id]",
              "setting_order": "22",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "212",
              "function_id": "16",
              "path": "/contract/contract_song/prepaid/update/contract_id/:contract_id",
              "name": null,
              "component": "./contract/contract_song/prepaid/update/[id]",
              "setting_order": "22",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "22",
              "function_id": "16",
              "path": "/contract/contract_song/prepaid/update/contract_id/:contract_id/prepaid_id/:prepaid_id",
              "name": null,
              "component": "./contract/contract_song/prepaid/update/[id]",
              "setting_order": "23",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "23",
              "function_id": "17",
              "path": "/contract/contract_author",
              "name": "藝人合約",
              "component": "./contract/contract_author/basic",
              "setting_order": "24",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "24",
              "function_id": "17",
              "path": "/contract/contract_author/adv/:id",
              "name": null,
              "component": "./contract/contract_author/adv/[id]",
              "setting_order": "25",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "25",
              "function_id": "18",
              "path": "/contract/contract_author/update",
              "name": null,
              "component": "./contract/contract_author/update/[id]",
              "setting_order": "26",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "26",
              "function_id": "18",
              "path": "/contract/contract_author/update/:id",
              "name": null,
              "component": "./contract/contract_author/update/[id]",
              "setting_order": "27",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "27",
              "function_id": "22",
              "path": "/contract/contract_author/prepaid/contract_id/:contract_id",
              "name": null,
              "component": "./contract/contract_author/prepaid/[id]",
              "setting_order": "28",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "28",
              "function_id": "22",
              "path": "/contract/contract_author/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id",
              "name": null,
              "component": "./contract/contract_author/prepaid/[id]",
              "setting_order": "29",
              "parent_id": "15",
              "menu_level": "2",
              "layout": "3"
            }
          ]
        },
        {
          "id": "29",
          "function_id": "23",
          "path": "/isrc",
          "name": "ISRC",
          "component": "./isrc/basic",
          "setting_order": "30",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "30",
          "function_id": "23",
          "path": "/isrc/adv/:id",
          "name": null,
          "component": "./isrc/adv/[id]",
          "setting_order": "31",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "31",
          "function_id": "24",
          "path": "/isrc/update",
          "name": null,
          "component": "./isrc/update/[id]",
          "setting_order": "32",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "32",
          "function_id": "24",
          "path": "/isrc/update/id/:id",
          "name": null,
          "component": "./isrc/update/[id]",
          "setting_order": "33",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "33",
          "function_id": "24",
          "path": "/isrc/update/song_code/:song_code",
          "name": null,
          "component": "/isrc/update/song_code/:song_code",
          "setting_order": "34",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "34",
          "function_id": "29",
          "path": "/album",
          "name": "專輯",
          "component": "./album/basic",
          "setting_order": "35",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "35",
          "function_id": "29",
          "path": "/album/adv/:id",
          "name": null,
          "component": "./album/adv/[id]",
          "setting_order": "36",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "36",
          "function_id": "30",
          "path": "/album/update",
          "name": null,
          "component": "./album/update/[id]",
          "setting_order": "37",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "37",
          "function_id": "30",
          "path": "/album/update/:id",
          "name": null,
          "component": "./album/update/[id]",
          "setting_order": "38",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "38",
          "function_id": "30",
          "path": "/album/update/copy/:id",
          "name": null,
          "component": "/album/update/copy/:id",
          "setting_order": "39",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "39",
          "function_id": "32",
          "path": "/album/song_seq/id/:id",
          "name": null,
          "component": "./album/song_seq/[id]",
          "setting_order": "40",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "40",
          "function_id": "32",
          "path": "/album/song_seq/id/:id/disc_id/:disc_id",
          "name": null,
          "component": "./album/song_seq/[id]",
          "setting_order": "41",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "41",
          "function_id": "32",
          "path": "/album/prepaid/album_id/:id/disc_content_id/:disc_content_id",
          "name": null,
          "component": "./album/prepaid/[id]",
          "setting_order": "42",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "42",
          "function_id": "33",
          "path": "/album/rights/:id",
          "name": null,
          "component": "./album/rights/[id]",
          "setting_order": "43",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "43",
          "function_id": "35",
          "path": "/souvenir",
          "name": "明星商品",
          "component": "./souvenir/basic",
          "setting_order": "44",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "44",
          "function_id": "36",
          "path": "/souvenir/update",
          "name": null,
          "component": "./souvenir/update/[id]",
          "setting_order": "45",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "45",
          "function_id": "36",
          "path": "/souvenir/update/:id",
          "name": null,
          "component": "./souvenir/update/[id]",
          "setting_order": "46",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "46",
          "function_id": "37",
          "path": "/misc",
          "name": "其他授權",
          "component": "./misc/basic",
          "setting_order": "47",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "47",
          "function_id": "37",
          "path": "/misc/adv/:id",
          "name": null,
          "component": "./misc/adv/[id]",
          "setting_order": "48",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "48",
          "function_id": "38",
          "path": "/misc/update",
          "name": null,
          "component": "./misc/update/[id]",
          "setting_order": "49",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "49",
          "function_id": "38",
          "path": "/misc/update/:id",
          "name": null,
          "component": "./misc/update/[id]",
          "setting_order": "50",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "50",
          "function_id": "39",
          "path": "/karaoke",
          "name": "卡拉 OK",
          "component": "./karaoke/basic",
          "setting_order": "51",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "51",
          "function_id": "39",
          "path": "/karaoke/adv/:id",
          "name": null,
          "component": "./karaoke/adv/[id]",
          "setting_order": "52",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "52",
          "function_id": "40",
          "path": "/karaoke/update",
          "name": null,
          "component": "./karaoke/update/[id]",
          "setting_order": "53",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "53",
          "function_id": "40",
          "path": "/karaoke/update/:id",
          "name": null,
          "component": "./karaoke/update/[id]",
          "setting_order": "54",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "54",
          "function_id": "40",
          "path": "/karaoke/update/copy/:id",
          "name": null,
          "component": "./karaoke/update/[id]",
          "setting_order": "55",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "55",
          "function_id": null,
          "path": "/information",
          "name": "基本資料",
          "component": null,
          "setting_order": "56",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3",
          "routes": [
            {
              "id": "56",
              "function_id": "41",
              "path": "/information/author",
              "name": "藝人/作者",
              "component": "./information/author/basic",
              "setting_order": "57",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "57",
              "function_id": "41",
              "path": "/information/author/adv/:id/info",
              "name": null,
              "component": "./information/author/adv/[id]",
              "setting_order": "58",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "58",
              "function_id": "41",
              "path": "/information/author/adv/:id/isrc",
              "name": null,
              "component": "./information/author/adv/[id]",
              "setting_order": "59",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "59",
              "function_id": "17",
              "path": "/information/author/adv/:id/contract_author",
              "name": null,
              "component": "./information/author/adv/[id]",
              "setting_order": "60",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "60",
              "function_id": "13",
              "path": "/information/author/adv/:id/contract_song",
              "name": null,
              "component": "./information/author/adv/[id]",
              "setting_order": "61",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "61",
              "function_id": "6",
              "path": "/information/author/adv/:id/song_rights",
              "name": null,
              "component": "./information/author/adv/[id]",
              "setting_order": "62",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "62",
              "function_id": "42",
              "path": "/information/author/update",
              "name": null,
              "component": "./information/author/update/[id]",
              "setting_order": "63",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "63",
              "function_id": "42",
              "path": "/information/author/update/:id",
              "name": null,
              "component": "./information/author/update/[id]",
              "setting_order": "64",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "64",
              "function_id": "43",
              "path": "/information/company",
              "name": "公司",
              "component": "./information/company/basic",
              "setting_order": "65",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "65",
              "function_id": "43",
              "path": "/information/company/adv/:id/info",
              "name": null,
              "component": "./information/company/adv/[id]",
              "setting_order": "66",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "66",
              "function_id": "17",
              "path": "/information/company/adv/:id/contract_author",
              "name": null,
              "component": "./information/company/adv/[id]",
              "setting_order": "67",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "67",
              "function_id": "13",
              "path": "/information/company/adv/:id/contract_song",
              "name": null,
              "component": "./information/company/adv/[id]",
              "setting_order": "68",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "68",
              "function_id": "44",
              "path": "/information/company/update",
              "name": null,
              "component": "./information/company/update/[id]",
              "setting_order": "69",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "69",
              "function_id": "44",
              "path": "/information/company/update/:id",
              "name": null,
              "component": "./information/company/update/[id]",
              "setting_order": "70",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            },
            {
              "id": "70",
              "function_id": "44",
              "path": "/information/company/adv/:id/replace_settlement",
              "name": null,
              "component": "./information/company/adv/replace_settlement/[id]",
              "setting_order": "71",
              "parent_id": "55",
              "menu_level": "2",
              "layout": "3"
            }
          ]
        },
        {
          "id": "72",
          "function_id": "47",
          "path": "/setting/member",
          "name": null,
          "component": "./setting/member/basic",
          "setting_order": "73",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "73",
          "function_id": "47",
          "path": "/setting/member/adv/id/:id",
          "name": null,
          "component": "./setting/member/adv/[id]",
          "setting_order": "74",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "74",
          "function_id": "47",
          "path": "/setting/member/update/:id",
          "name": null,
          "component": "./setting/member/update/[id]",
          "setting_order": "75",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "75",
          "function_id": "45",
          "path": "/setting/export_files",
          "name": "匯出",
          "component": "./setting/export_files",
          "setting_order": "76",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "114",
          "function_id": "46",
          "path": "/test",
          "name": null,
          "component": "./test",
          "setting_order": "115",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        },
        {
          "id": "117",
          "function_id": "46",
          "path": "/ui_info",
          "name": null,
          "component": "./ui_info",
          "setting_order": "118",
          "parent_id": null,
          "menu_level": "1",
          "layout": "3"
        }
      ],
      "selected_list": [
        "/song",
        "/isrc",
        "/album",
        "/souvenir",
        "/misc",
        "/karaoke",
        "/setting/export_files",
        "/contract/contract_song",
        "/contract/contract_author",
        "/information/author",
        "/information/company"
      ],
      "permission_list": [
        "/authaccess/change_password",
        "/account",
        "/account/update",
        "/song",
        "/song/adv/id/:id",
        "/song/adv/song_code/:id",
        "/song/update",
        "/song/update/:id",
        "/song/rights/update/id/:id/song_code/:song_code",
        "/song/rights/update/song_code/:song_code",
        "/song/rights/transfer/id/:id/song_code/:song_code",
        "/contract",
        "/isrc",
        "/isrc/adv/:id",
        "/isrc/update",
        "/isrc/update/id/:id",
        "/isrc/update/song_code/:song_code",
        "/album",
        "/album/adv/:id",
        "/album/update",
        "/album/update/:id",
        "/album/update/copy/:id",
        "/album/song_seq/id/:id",
        "/album/song_seq/id/:id/disc_id/:disc_id",
        "/album/prepaid/album_id/:id/disc_content_id/:disc_content_id",
        "/album/rights/:id",
        "/souvenir",
        "/souvenir/update",
        "/souvenir/update/:id",
        "/misc",
        "/misc/adv/:id",
        "/misc/update",
        "/misc/update/:id",
        "/karaoke",
        "/karaoke/adv/:id",
        "/karaoke/update",
        "/karaoke/update/:id",
        "/karaoke/update/copy/:id",
        "/information",
        "/setting/member",
        "/setting/member/adv/id/:id",
        "/setting/member/update/:id",
        "/setting/export_files",
        "/test",
        "/ui_info",
        "/contract/contract_song",
        "/contract/contract_song/adv/id/:id",
        "/contract/contract_song/update",
        "/contract/contract_song/update/:id",
        "/contract/contract_song/transfer/:id",
        "/contract/contract_song/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id",
        "/contract/contract_song/prepaid/update/contract_id/:contract_id",
        "/contract/contract_song/prepaid/update/contract_id/:contract_id/prepaid_id/:prepaid_id",
        // "/contract/contract_song/prepaid/contract_id/:contract_id",
        // "/contract/contract_song/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id",
        "/contract/contract_author",
        "/contract/contract_author/adv/:id",
        "/contract/contract_author/update",
        "/contract/contract_author/update/:id",
        "/contract/contract_author/prepaid/contract_id/:contract_id",
        "/contract/contract_author/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id",
        "/information/author",
        "/information/author/adv/:id/info",
        "/information/author/adv/:id/isrc",
        "/information/author/adv/:id/contract_author",
        "/information/author/adv/:id/contract_song",
        "/information/author/adv/:id/song_rights",
        "/information/author/update",
        "/information/author/update/:id",
        "/information/company",
        "/information/company/adv/:id/info",
        "/information/company/adv/:id/contract_author",
        "/information/company/adv/:id/contract_song",
        "/information/company/update",
        "/information/company/update/:id",
        "/information/company/adv/:id/replace_settlement"
      ]
    }
  };

  setTimeout(() => {
    return res.json(result);
  }, 1000);
}

function getList(req, res) {
  const result = {
    "data": [
      {
        "id": "1",
        "function_id": "0",
        "layout": "2",
        "path": "/authaccess/change_userdata",
        "parent_id": null,
        "description": "修改個人資料",
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "2",
        "function_id": "0",
        "layout": "2",
        "path": "/authaccess/change_password",
        "parent_id": null,
        "description": "修改密碼",
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "3",
        "function_id": "0",
        "layout": "3",
        "path": "/account",
        "parent_id": null,
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "4",
        "function_id": "0",
        "layout": "3",
        "path": "/song",
        "parent_id": null,
        "description": "歌曲",
        "menu_style": "2",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "5",
        "function_id": "0",
        "layout": "3",
        "path": "/song/adv/id/:id",
        "parent_id": "4",
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "6",
        "function_id": "0",
        "layout": "3",
        "path": "/song/adv/song_code/:id",
        "parent_id": "4",
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "7",
        "function_id": "0",
        "layout": "3",
        "path": "/song/update",
        "parent_id": "4",
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "8",
        "function_id": "0",
        "layout": "3",
        "path": "/song/update/:id",
        "parent_id": "4",
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "9",
        "function_id": "0",
        "layout": "3",
        "path": "/song/rights/update/id/:id",
        "parent_id": "4",
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "10",
        "function_id": "0",
        "layout": "3",
        "path": "/song/rights/update/song_code/:id",
        "parent_id": "4",
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      },
      {
        "id": "11",
        "function_id": "0",
        "layout": "3",
        "path": "/song/rights/transfer/id/:id",
        "parent_id": "4",
        "description": null,
        "menu_style": "3",
        "notes": null,
        "is_status": "1"
      }
    ]
  };

  return res.json(result);
}

function updateData(req, res) {
  const result = {
    data: "更新成功"
  };

  return res.json(result);
}

export default {
  'get    /ui_route/init_menu': getInitMenu,
  'get    /ui_route': getList,  // 查詢所有路由
  'put    /ui_route': updateData,  // 新增路由
  'patch  /ui_route': updateData,  //修改路由
  // 'patch  /ui_route/change_oreder': ???,  //修改設定介面順序
  'post   /ui_route/delete': updateData,   // 刪除路由
};
