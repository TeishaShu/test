import React, { useState, useEffect, Fragment } from 'react';
import {
  Input,
  InputNumber,
  Form,
  Select,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { TextArea } = Input;

const ComUiSong = props => {
  const {
    form,
    value,
    onChange,
    uiSongItem,
    setUiSongItem,
    uiSongList,
    setUiSongList,
    getContractSplitData,
    parentIdx,
    updateComUiSong,
    getUiSongDataForIsrc,
    getContractAuthorSplitData,
    showUiSongOrPack,
    getIsrcData,
  } = props
  const [data, setData] = useState({});
  const [isFetching, setIsFetching] = useState(false);

  // api -----
  // updateComUiSong
  useEffect(() => {
    let tmpForm = form.getFieldValue()['ui_song'];

    if (!tmpForm) {
      tmpForm = {};
    }

    updateData({
      // 詞曲
      flat_fee: (tmpForm.flat_fee) ? (tmpForm.flat_fee) : (''),
      syn_fee: (tmpForm.syn_fee) ? (tmpForm.syn_fee) : (''),
      mech_flat_fee: (tmpForm.mech_flat_fee) ? (tmpForm.mech_flat_fee) : (''),
      split_id: (tmpForm.split_id) ? (tmpForm.split_id) : ([]),
      // 錄音
      isrc_id: (tmpForm.isrc_id) ? (tmpForm.isrc_id) : (''),
      isrc_comission_id: (tmpForm.isrc_comission_id) ? (tmpForm.isrc_comission_id) : ([]),
      // pack
      pack_split_id: (tmpForm.pack_split_id) ? (tmpForm.pack_split_id) : (''),
      // 錄音或 pack
      amount: (tmpForm.amount) ? (tmpForm.amount) : (''),
      // all
      notes: (tmpForm.notes) ? (tmpForm.notes) : ('')
    });
  }, [updateComUiSong]);

  // updateData
  const updateData = (updateItem) => {
    setData(updateItem);
    onChange(updateItem);
  }

  // ui -----
  // songAmountText
  const songAmountText = (setting) => {
    let tmpText = 0;

    if (!isNaN(parseFloat(setting.flat_fee))) {
      tmpText = commFn.calAdd(tmpText, setting.flat_fee);
    }

    if (!isNaN(parseFloat(setting.syn_fee))) {
      tmpText = commFn.calAdd(tmpText, setting.syn_fee);
    }

    if (!isNaN(parseFloat(setting.mech_flat_fee))) {
      tmpText = commFn.calAdd(tmpText, setting.mech_flat_fee);
    }

    return tmpText;
  }

  // recordAmountText
  const recordAmountText = (setting) => {
    let tmpText = 0;

    if (!isNaN(parseFloat(setting.amount))) {
      tmpText = commFn.calAdd(tmpText, setting.amount);
    }

    return tmpText;
  }

  // recordTextTr
  const recordTextTr = () => {
    return (
      <tr>
        <td colSpan="2">&nbsp;</td>
        <td
          className={styles.om_bg_green}
          style={{ textAlign: 'left', fontWeight: '700' }}
        >
          <p>Total</p>
        </td>
        <td
          className={styles.om_bg_green}
          style={{ textAlign: 'right', fontWeight: '700' }}
        >
          <p>{recordAmountText(data)}</p>
        </td>
      </tr>
    );
  }

  // uiFee
  const uiFee = (
    <Fragment>
      <td>
        <Form.Item>
          <InputNumber
            style={{ width: '100%' }}
            value={(data) ? (data.flat_fee) : ('')}
            onChange={(val) => {
              updateData({ ...data, flat_fee: val, is_edit: '1' });
            }}
          />
        </Form.Item>
      </td>
      <td>
        <Form.Item>
          <InputNumber
            style={{ width: '100%' }}
            value={(data) ? (data.syn_fee) : ('')}
            onChange={(val) => {
              updateData({ ...data, syn_fee: val, is_edit: '1' });
            }}
          />
        </Form.Item>
      </td>
      <td>
        <Form.Item>
          <InputNumber
            style={{ width: '100%' }}
            value={(data) ? (data.mech_flat_fee) : ('')}
            onChange={(val) => {
              updateData({ ...data, mech_flat_fee: val, is_edit: '1' });
            }}
          />
        </Form.Item>
      </td>
    </Fragment>
  );

  // isrcSelect
  const isrcSelect = (
    <td>
      <Form.Item>
        <Select
          style={{ width: '200px' }}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          value={(data) ? (data.isrc_id) : ('')}
          options={
            (uiSongItem && uiSongItem.isrcOpts)
              ? (uiSongItem.isrcOpts)
              : ([])
          }
          onChange={(value) => {
            updateData({ ...data, isrc_id: value, is_edit: '1' });
            getUiSongDataForIsrc(value);
          }}
          onFocus={() => {
            setIsFetching(true);

            let tmpSongCode = form.getFieldValue()['song_code'];

            getIsrcData((tmpSongCode) ? (tmpSongCode) : ('')).then((result) => {
              setUiSongItem((prev) => {
                let tmpUiSongList = { ...prev };

                if (!tmpUiSongList) {
                  tmpUiSongList = {};
                }

                if (!tmpUiSongList.isrcOpts) {
                  tmpUiSongList.isrcOpts = [];
                }

                tmpUiSongList.isrcOpts = result;

                return tmpUiSongList;
              });

              setIsFetching(false);
            });
          }}
        />
      </Form.Item>
    </td>
  );

  // amountInput
  const amountInput = (
    <td>
      <Form.Item>
        <InputNumber
          style={{ width: '200px' }}
          value={(data) ? (data.amount) : ('')}
          onChange={(val) => {
            updateData({ ...data, amount: val, is_edit: '1' });
          }}
        />
      </Form.Item>
    </td>
  );

  return (
    <Fragment>
      <div style={{ display: (showUiSongOrPack == '1') ? 'block' : 'none' }}>
        {/* lyrics */}
        <p>詞曲</p>
        <table className={styles.formTable}>
          <thead>
            <tr>
              <th>作者摘要</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
              <th style={{ width: '200px' }}>拆分類型</th>
              <th>Flat Fee</th>
              <th>Syn Fee</th>
              <th>Mech Flat Fee</th>
            </tr>
          </thead>
          <tbody>
            {
              (uiSongItem && uiSongItem.rightList && uiSongItem.rightList.length > 0)
                ? (uiSongItem.rightList.map((elem, idx) => (
                  <tr key={`lyrics_${idx}`}>
                    <td className={styles.bottomPdTd}><p>{elem.name}</p></td>
                    <td><p>{elem.rights_type}</p></td>
                    <td><p>{elem.rights_ratio}</p></td>
                    <td>
                      <Select
                        notFoundContent={isFetching ? <Spin size="small" /> : null}
                        options={
                          (uiSongItem.rightSplitOpts && uiSongItem.rightSplitOpts[idx])
                            ? (uiSongItem.rightSplitOpts[idx])
                            : ([])
                        }
                        value={
                          (data && data.split_id && data.split_id[idx])
                            ? (data.split_id[idx])
                            : ('')
                        }
                        onChange={(value) => {
                          let tmpSplitIds = data.split_id.slice();
                          tmpSplitIds[idx] = value;
                          updateData({ ...data, split_id: tmpSplitIds, is_edit: '1' });
                        }}
                        onFocus={() => {
                          setIsFetching(true);

                          getContractSplitData(uiSongItem.rightList[idx]).then((result) => {
                            setUiSongItem((prev) => {
                              let tmpUiSongList = { ...prev };

                              if (!tmpUiSongList.rightSplitOpts) {
                                tmpUiSongList.rightSplitOpts[idx] = [];
                              }

                              tmpUiSongList.rightSplitOpts[idx] = result;

                              return tmpUiSongList;
                            });

                            setIsFetching(false);
                          });
                        }}
                      />
                    </td>
                    {
                      (idx == 0)
                        ? (uiFee)
                        : (<td colSpan="3"><p>&nbsp;</p></td>)
                    }
                  </tr>
                )))
                : (
                  <tr>
                    <td colSpan="4" className={styles.bottomPdTd}><p>&nbsp;</p></td>
                    {uiFee}
                  </tr>
                )
            }
            <tr>
              <td colSpan="5">&nbsp;</td>
              <td
                className={styles.om_bg_yellow}
                style={{ textAlign: 'left', fontWeight: '700' }}
              >
                <p>Total</p>
              </td>
              <td className={styles.om_bg_yellow}>
                <p>{songAmountText(data)}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <br /><br />
        {/* songRecord */}
        <p>錄音</p>
        <table className={styles.formTable}>
          <thead>
            <tr>
              <th>ISRC</th>
              <th>演唱人</th>
              <th style={{ width: '200px' }}>拆分類型</th>
              <th style={{ width: '100px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              (uiSongItem && uiSongItem.isrcSingerList && uiSongItem.isrcSingerList.length > 0)
                ? (uiSongItem.isrcSingerList.map((elem, idx) => (
                  <tr key={`record_${idx}`}>
                    {
                      (idx == 0)
                        ? (isrcSelect)
                        : (<td><p>&nbsp;</p></td>)
                    }
                    <td className={styles.bottomPdTd}>{elem.author_name}</td>
                    <td>
                      <Select
                        notFoundContent={isFetching ? <Spin size="small" /> : null}
                        options={
                          (uiSongItem.isrcSplitOpts && uiSongItem.isrcSplitOpts[idx])
                            ? (uiSongItem.isrcSplitOpts[idx])
                            : ([])
                        }
                        value={
                          (data && data.isrc_comission_id && data.isrc_comission_id[idx])
                            ? (data.isrc_comission_id[idx])
                            : ('')
                        }
                        onChange={(value) => {
                          let tmpSplitIds = data.isrc_comission_id.slice();
                          tmpSplitIds[idx] = value;

                          updateData({ ...data, isrc_comission_id: tmpSplitIds, is_edit: '1' });
                        }}
                        onFocus={() => {
                          setIsFetching(true);

                          getContractAuthorSplitData(uiSongItem.isrcSingerList[idx]).then((result) => {
                            setUiSongItem((prev) => {
                              let tmpUiSongList = { ...prev };

                              if (!tmpUiSongList.isrcSplitOpts) {
                                tmpUiSongList.isrcSplitOpts = [];
                              }

                              tmpUiSongList.isrcSplitOpts[idx] = result;

                              return tmpUiSongList;
                            });

                            setIsFetching(false);
                          });
                        }}
                      />
                    </td>
                    {
                      (idx == 0)
                        ? (amountInput)
                        : (<td className={styles.bottomPdTd}><p>&nbsp;</p></td>)
                    }
                  </tr>
                )))
                : (
                  <tr>
                    {isrcSelect}
                    <td><p>-</p></td>
                    <td><p>-</p></td>
                    {amountInput}
                  </tr>
                )
            }
            {recordTextTr()}
          </tbody>
        </table>
      </div>
      {/* pack */}
      <div style={{ display: (showUiSongOrPack == '2') ? 'block' : 'none' }}>
        <p>錄音</p>
        <table className={styles.formTable}>
          <thead>
            <tr>
              <th>ISRC</th>
              <th>演唱人</th>
              <th style={{ width: '200px' }}>拆分類型</th>
              <th style={{ width: '100px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>-</p></td>
              <td><p>-</p></td>
              <td>
                <Select
                  notFoundContent={isFetching ? <Spin size="small" /> : null}
                  options={
                    (uiSongItem.packSplitOpt)
                      ? (uiSongItem.packSplitOpt)
                      : ([])
                  }
                  value={
                    (data)
                      ? (data.pack_split_id)
                      : ('')
                  }
                  onChange={(value) => {
                    updateData({ ...data, pack_split_id: value, is_edit: '1' });
                  }}
                  onFocus={() => {
                    let tmpeContractAuthorId = '';
                    let splitContractId = [];

                    if (form.getFieldValue()['ui_contract_author_id']) {
                      splitContractId = form.getFieldValue()['ui_contract_author_id'].split('_');

                      if (splitContractId.length > 1) {
                        tmpeContractAuthorId = splitContractId[0];
                      }

                    }

                    setIsFetching(true);

                    getContractAuthorSplitData({ contract_author_id: tmpeContractAuthorId }).then((result) => {
                      setUiSongItem((prev) => {
                        let tmpUiSongList = { ...prev };

                        if (!tmpUiSongList) {
                          tmpUiSongList = {};
                        }

                        if (!tmpUiSongList.packSplitOpt) {
                          tmpUiSongList.packSplitOpt = [];
                        }

                        tmpUiSongList.packSplitOpt = result;

                        return tmpUiSongList;
                      });

                      setIsFetching(false);
                    });
                  }}
                />
              </td>
              {amountInput}
            </tr>
            {recordTextTr()}
          </tbody>
        </table>
      </div>
      <br /><br />
      <div>
        <Form.Item
          label="備註"
          style={{ width: '33.333%' }}
        >
          <TextArea
            rows={4}
            value={(data) ? (data.notes) : ('')}
            onChange={(e) => {
              updateData({ ...data, notes: e.target.value, is_edit: '1' });
            }}
          />
        </Form.Item>
      </div>
    </Fragment>
  );
};

export default ComUiSong;
