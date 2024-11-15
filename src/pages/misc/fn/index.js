const miscFn = {
  createUiListItem: (isrcOpts, isrcSingerList, isrcSplitOpts, packSplitOpt, rightList, rightSplitOpts) => {
    class UiListItemContructor {
      constructor(isrcOpts, isrcSingerList, isrcSplitOpts, packSplitOpt, rightList, rightSplitOpts) {
        this.isrcOpts = (isrcOpts) ? (isrcOpts.map((elem) => ({ ...elem }))) : [];
        this.isrcSingerList = (isrcSingerList) ? (isrcSingerList.map((elem) => ({ ...elem }))) : [];
        this.isrcSplitOpts = (isrcSplitOpts) ? (isrcSplitOpts.map((elem) => ({ ...elem }))) : [];
        this.packSplitOpt = (packSplitOpt) ? (packSplitOpt.map((elem) => ({ ...elem }))) : [];
        this.rightList = (rightList) ? (rightList.map((elem) => ({ ...elem }))) : [];
        this.rightSplitOpts = (rightSplitOpts) ? (rightSplitOpts) : [];
      }
    }

    return new UiListItemContructor(isrcOpts, isrcSingerList, isrcSplitOpts, packSplitOpt, rightList, rightSplitOpts);
  },
  createUiSong: (notes, flat_fee, syn_fee, mech_flat_fee, isrc_id, amount) => {
    class UiSongContructor {
      constructor(notes, flat_fee, syn_fee, mech_flat_fee, isrc_id, amount) {
        this.notes = (notes) ? (notes) : '';
        // 詞曲
        this.flat_fee = (flat_fee) ? (flat_fee) : '';
        this.syn_fee = (syn_fee) ? (syn_fee) : '';
        this.mech_flat_fee = (mech_flat_fee) ? (mech_flat_fee) : '';
        this.split_id = [];
        // 錄音
        this.isrc_id = (isrc_id) ? (isrc_id) : '';
        this.isrc_comission_id = [];
        // pack
        this.pack_split_id = '';
        // 錄音或 pack
        this.amount = (amount) ? (amount) : '';
      }
    }

    return new UiSongContructor(notes, flat_fee, syn_fee, mech_flat_fee, isrc_id, amount);
  },
  createContentContructor: (name, use_type_id, type) => {
    class ContentContructor {
      constructor(name, use_type_id, type) {
        // this.id = null;
        // this.cm_id = null;
        this.name = (name) ? (name) : null;
        this.use_type_id = (use_type_id) ? (use_type_id) : null;
        this.type = (type) ? (type) : null;
        this.song_code = null;
        this.song_name = null;
        this.notes = null;
        this.ui_song = {};
        // 1. 歌曲
        this.song_id = null;
        this.distribution_format = null;
        this.flat_fee = null;
        this.syn_fee = null;
        this.mech_flat_fee = null;
        this.mech_adv = null;
        this.isrc_id = null;
        this.lyrics = [];
        this.record = [];
        // 2. pack
        this.contract_author_id = null;
        this.contract_author_subcontract_id = null;
        // 共用
        this.amount = null;
      }
    }

    return new ContentContructor(name, use_type_id, type);
  },
  converttypeIdToStr(id) {
    if (id == '2') {
      return 'Pack';
    }

    return '歌曲';
  },
  convertSplitOptStr(str) {
    if (!str) {
      return '';
    }

    if (str.indexOf('Vocal') >= 0) {
      str = str.replace('Vocal', '數位-Vocal');
    }

    if (str.indexOf('Video') >= 0) {
      str = str.replace('Video', '數位-Video');
    }

    if (str[str.length - 1] == '-') {
      str += '其他地區';
    }

    return str;
  }
};

export default miscFn;