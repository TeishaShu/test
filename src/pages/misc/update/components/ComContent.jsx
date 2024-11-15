import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Form,
  Select,
  Spin,
  Tooltip,
} from 'antd';
import { connect, history } from 'umi';
import { CloseOutlined, CopyOutlined, FileSyncOutlined } from "@ant-design/icons";
import FormSongId from './FormSongId';
import FormContractAuthorId from './FormContractAuthorId';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import miscFn from '../../fn';

const { TextArea } = Input;

export const ComContent = props => {
  const {
    dispatch,
    useTypeList,
    miscList: { multiChangeId, miscFormTmpContent },
    parentId,
    parentIdx,
    soldDate,
    changeSoldDate,
    setViewLoading,
    isSubmit,
    addContent,
  } = props;
  // edit, delete
  const refDelete = useRef('');
  const refEdit = useRef('');
  // 產品名稱
  const [name, setName] = useState('');
  // 使用方式
  const [useTypeId, setUseTypeId] = useState('');
  // 型態
  const [type, setType] = useState([]);
  const refType1_1 = useRef('');
  const refType1_2 = useRef('');
  const refType1_3 = useRef('');
  const refType2_1 = useRef('');
  const refType2_2 = useRef('');
  // 銷售日期改變提示
  let orgChangeSoldDate = 0;
  const refSoldDateHint = useRef('');
  // 歌曲 - 歌曲名稱
  const [songId, setSongId] = useState('');
  const [songIdList, setSongIdList] = useState([]);
  const [songIdCode, setSongIdCode] = useState('');
  const [songIdName, setSongIdName] = useState('');
  // 歌曲 - 權利型態
  const [distributionFormat, setDistributionFormat] = useState('');
  // 歌曲 - 詞曲
  const [songTable, setSongTable] = useState([]);
  // 歌曲 - isrc
  const [isFetching, setIsFetching] = useState(false);
  const [isrcId, setIsrcId] = useState('');
  const [isrcList, setIsrcList] = useState([]);
  // 歌曲 - 錄音
  const [recordTable, setRecordTable] = useState([]);
  // pack - 藝人發行合約
  const [contractAuthorUiId, setContractAuthorUiId] = useState('');
  const [contractAuthorUiIdName, setContractAuthorUiIdName] = useState({
    keyword: '',
    contract_code: '',
    subcontractcode: '',
  });
  const [contractAuthorList, setContractAuthorList] = useState([]);
  const [contractAuthorPartyB, setContractAuthorPartyB] = useState('');
  // pack - 錄音
  const [packTable, setPackTable] = useState({});
  // 備註
  const [notes, setNotes] = useState('');
  // cal -----
  const refFlatFee = useRef('');
  const refSynFee = useRef('');
  const refMechFlatFee = useRef('');
  const recordAmount = useRef('');
  const packAmount = useRef('');
  const inputNumberStyle = {
    width: '100%',
    height: '32px',
    padding: '4px 11px',
    textAlign: 'left',
    border: '1px solid rgb(217, 217, 217)',
    borderRadius: '2px',
    outline: '0',
    transition: 'all 0.3s linear',
    lineHeight: '22.001px'
  };

  const initData = () => {
    if (miscFormTmpContent && miscFormTmpContent[parentIdx]) {
      let tmpItem = miscFormTmpContent[parentIdx];

      // 若新增或複製，觸發為改變狀態
      if (tmpItem.ui_new) {
        handleRefEdit();
      } else {
        refEdit.current = false;
      }

      // 銷售日期改變提示
      if (tmpItem.ui_new && tmpItem.ui_sold_date_hint) {
        refSoldDateHint.current.style.display = 'inline';
      } else {
        refSoldDateHint.current.style.display = 'none';
      }

      // 產品名稱
      setName(tmpItem.name);
      // 使用方式
      setUseTypeId(tmpItem.use_type_id);
      // 型態
      handleType(tmpItem.type);
      // 歌曲 - 歌曲名稱
      setSongId(tmpItem.song_id);
      if (tmpItem.song_id) {
        setSongIdList([{ id: tmpItem.song_id, song_name: tmpItem.song_name, song_code: tmpItem.song_code }]);
      } else {
        setSongIdList([]);
      }
      setSongIdCode(tmpItem.song_code);
      setSongIdName(tmpItem.song_name);
      // 歌曲 - 權利型態
      if (tmpItem.distribution_format) {
        setDistributionFormat(tmpItem.distribution_format);
      } else {
        setDistributionFormat('');
      }
      // 歌曲 - 詞曲
      if (tmpItem.lyrics) {
        setSongTable(tmpItem.lyrics.map((elem) => ({
          ...elem,
          ui_split_opt: [{ value: elem.commission_id, label: miscFn.convertSplitOptStr(elem.split_type) }]
        })));
      } else {
        setSongTable([]);
      }
      // 歌曲 - isrc
      setIsrcId(tmpItem.isrc_id);
      if (tmpItem.isrc) {
        setIsrcList([{ value: tmpItem.isrc_id, label: tmpItem.isrc }]);
      } else {
        setIsrcList([]);
      }
      // 歌曲 - 錄音
      if (tmpItem.type != '2' && tmpItem.record) {
        setRecordTable(tmpItem.record.map((elem) => ({
          ...elem,
          ui_split_opt: [{ value: elem.commission_id, label: miscFn.convertSplitOptStr(elem.split_type) }]
        })));
      } else {
        setRecordTable([]);
      }
      // pack - 藝人發行合約
      if (tmpItem.contract_author_id) {
        let tmpContractAuthorId = `${tmpItem.contract_author_id}_${(tmpItem.contract_author_subcontract_id) ? (tmpItem.contract_author_subcontract_id) : ('')}`
        setContractAuthorUiId(tmpContractAuthorId);
        setContractAuthorUiIdName({
          keyword: (tmpItem.contract_author_subcontract_id) ? (tmpItem.contract_author_subcontract_code) : (tmpItem.contract_author_code),
          contract_code: tmpItem.contract_author_code,
          subcontractcode: tmpItem.contract_author_subcontract_code,
        });
        setContractAuthorList([{
          ui_id: tmpContractAuthorId,
          id: tmpItem.contract_author_id,
          contract_code: tmpItem.contract_author_code,
          subcontract_id: tmpItem.contract_author_subcontract_id,
          subcontract_code: tmpItem.contract_author_subcontract_code,
        }]);
        setContractAuthorPartyB(
          (tmpItem.settle_company_name)
            ? (tmpItem.settle_company_name)
            : (
              (tmpItem.subcontract_author_name)
                ? (tmpItem.subcontract_author_name)
                : (
                  (tmpItem.subcontract_parent_author_name)
                    ? (tmpItem.subcontract_parent_author_name)
                    : ('')
                )
            )
        );
      } else {
        setContractAuthorUiId('');
        setContractAuthorUiIdName({
          keyword: '',
          contract_code: '',
          subcontractcode: '',
        });
        setContractAuthorList([]);
        setContractAuthorPartyB('');
      }
      // pack - 錄音
      if (tmpItem.type == '2' && tmpItem.record && tmpItem.record[0]) {
        setPackTable({
          ...tmpItem.record[0],
          ui_split_opt: [{ value: tmpItem.record[0].commission_id, label: miscFn.convertSplitOptStr(tmpItem.record[0].split_type) }]
        });
      } else {
        setPackTable({});
      }
      // 備註
      setNotes((tmpItem.notes) ? (tmpItem.notes) : (''));
      // cal
      refFlatFee.current.value = tmpItem.flat_fee;
      refSynFee.current.value = tmpItem.syn_fee;
      refMechFlatFee.current.value = tmpItem.mech_flat_fee;
      recordAmount.current.value = (tmpItem.type != '2') ? tmpItem.amount : '';
      packAmount.current.value = (tmpItem.type != '2') ? '' : tmpItem.amount;
    }
  }

  useEffect(() => {
    orgChangeSoldDate = changeSoldDate;
    initData();
  }, []);

  useEffect(() => {
    initData();
  }, [multiChangeId]);

  // changeSoldDate
  useEffect(() => {
    if (orgChangeSoldDate != changeSoldDate && changeSoldDate > 0) {
      refSoldDateHint.current.style.display = 'inline';
    }
  }, [changeSoldDate]);

  useEffect(() => {
    let tmpContractAuthorIdArr = (contractAuthorUiId) ? (contractAuthorUiId.split('_')) : [];
    let tmpContentArr = [];
    let tmpContent = {
      name: name,
      use_type_id: (useTypeId) ? (useTypeId) : (null),
      type: type,
      song_id: (songId) ? (songId) : (null),
      distribution_format: (distributionFormat) ? (distributionFormat) : (null),
      isrc_id: (type == '1' && isrcId) ? (isrcId) : null,
      contract_author_id: (type == '2' && tmpContractAuthorIdArr[0]) ? (tmpContractAuthorIdArr[0]) : null,
      contract_author_subcontract_id: (type == '2' && tmpContractAuthorIdArr[1]) ? (tmpContractAuthorIdArr[1]) : null,
      lyrics: [],
      record: [],
      flat_fee: refFlatFee.current.value,
      syn_fee: refSynFee.current.value,
      mech_flat_fee: refMechFlatFee.current.value,
      mech_adv: null,
      amount: (type == '2') ? (packAmount.current.value) : (recordAmount.current.value),
      notes: (notes) ? (notes) : (null),
    };
    let tmpOldContent = (miscFormTmpContent && miscFormTmpContent[parentIdx]) ? ({ ...miscFormTmpContent[parentIdx] }) : null;
    let tmpOldId = (tmpOldContent && tmpOldContent.id) ? (tmpOldContent.id) : null;
    let tmpUiSoldDateHint = (refSoldDateHint.current && refSoldDateHint.current.style.display == 'inline') ? (true) : (false);

    if (isSubmit > 0) {
      tmpContent.id = tmpOldId;
      tmpContent.cm_id = (tmpOldContent && tmpOldContent.cm_id) ? (tmpOldContent.cm_id) : (parentId ? parentId : null);

      if (!refEdit.current && !refDelete.current.value) {
        tmpContentArr = {
          ui_ok: true,
          ui_sold_date_hint: tmpUiSoldDateHint,
        };
      } else if (refDelete.current.value && tmpOldId) {
        // delete old content
        if (tmpOldContent) {
          tmpOldContent.is_delete = '1';

          if (tmpOldContent.lyrics) {
            tmpOldContent.lyrics = tmpOldContent.lyrics.map((elem) => ({ ...elem, is_delete: '1' }));
          }

          if (tmpOldContent.record) {
            tmpOldContent.record = tmpOldContent.record.map((elem) => ({ ...elem, is_delete: '1' }));
          }

          tmpContentArr.push(tmpOldContent);
        }
      } else if (refEdit.current) {
        tmpContent.ui_sold_date_hint = tmpUiSoldDateHint;

        if (tmpOldId) {
          tmpContent.is_edit = '1';
        } else {
          tmpContent.is_new = '1';
        }

        if (refDelete.current.value) {
          tmpContent.is_delete = '1';
        }

        // remove old item
        if (!tmpOldContent.ui_new) {
          if (tmpOldContent && tmpOldContent.lyrics) {
            tmpContent.lyrics = tmpOldContent.lyrics.map((elem) => ({ ...elem, is_delete: '1' }));
          }
          if (tmpOldContent && tmpOldContent.record) {
            tmpContent.record = tmpOldContent.record.map((elem) => ({ ...elem, is_delete: '1' }));
          }
        }

        // new item
        if (type == '1') {
          songTable.forEach((elem) => {
            tmpContent.lyrics.push({
              is_new: '1',
              cmc_id: tmpOldId,
              author_id: (elem.author_id) ? (elem.author_id) : null,
              song_right_id: (elem.song_right_id) ? (elem.song_right_id) : null,
              commission_id: (elem.commission_id) ? (elem.commission_id) : null,
            });
          });

          recordTable.forEach((elem) => {
            tmpContent.record.push({
              is_new: '1',
              cmc_id: tmpOldId,
              author_id: (elem.author_id) ? (elem.author_id) : null,
              isrc_split_id: (elem.isrc_split_id) ? (elem.isrc_split_id) : null,
              commission_id: (elem.commission_id) ? (elem.commission_id) : null,
            });
          });
        } else {
          if (packTable.commission_id) {
            tmpContent.record.push({
              is_new: '1',
              cmc_id: tmpOldId,
              author_id: null,
              isrc_split_id: null,
              commission_id: packTable.commission_id,
            });
          }
        }

        tmpContentArr.push(tmpContent);
      }

      dispatch({
        type: 'miscList/setMiscFormTmpSubmit',
        payload: {
          key: `content_${parentIdx}`,
          value: tmpContentArr,
        },
      });
    }
  }, [isSubmit]);

  // api -----
  const getContractSplitData = (contractSongId) => {
    return new Promise((resolve, reject) => {
      fetch(`${window.FRONTEND_WEB}/contract_song/view?id=${contractSongId}`)
        .then(res => res.json())
        .then(jsonData => {
          let opts = [];

          if (jsonData.data && jsonData.data.commission) {
            for (let i = 0; i < jsonData.data.commission.length; i++) {
              for (let j = 0; j < jsonData.data.commission[i].percentage.length; j++) {
                let percentItem = jsonData.data.commission[i].percentage[j];

                opts.push({ value: percentItem.id, label: `${jsonData.data.commission[i].name} - ${percentItem.name}` })
              }
            }
          }

          resolve(opts)
        }).catch(err => {
          resolve([]);
        });
    });
  }

  const getIsrcData = (songCode) => {
    return new Promise((resolve, reject) => {
      if (!songCode) {
        resolve([]);
      } else {
        fetch(`${window.FRONTEND_WEB}/song/detail_isrc?song_code=${songCode}`)
          .then(res => res.json())
          .then(jsonData => {
            let tmpData = (jsonData.data && jsonData.data.data_list) ? (jsonData.data.data_list) : ([]);

            tmpData = tmpData.map((elem) => ({ value: elem.id, label: elem.isrc }));

            resolve(tmpData);
          }).catch(err => {
            resolve([]);
          });
      }
    });
  }

  const getRightData = (songCode, idx) => {
    return new Promise((resolve, reject) => {
      let tmpObj = {
        song_code: songCode,
        type: distributionFormat,
        sold_date: soldDate,
      };

      if (!tmpObj.song_code || !tmpObj.type || !tmpObj.sold_date) {
        resolve([]);
      } else {
        fetch(`${window.FRONTEND_WEB}/contract_karaoke/get_song_rights`, {
          method: 'post',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify(tmpObj),
        })
          .then(res => res.json())
          .then(jsonData => {
            resolve((jsonData.data) ? (jsonData.data) : ([]));
          }).catch(err => {
            resolve([]);
          });
      }
    });
  }

  // getIsrcSplitData
  const getIsrcSplitData = (isrcId) => {
    return new Promise((resolve, reject) => {
      if (!isrcId) {
        resolve([]);
      } else {
        fetch(`${window.FRONTEND_WEB}/isrc/detail_split?isrc_id=${isrcId}`)
          .then(res => res.json())
          .then(jsonData => {
            let tmpData = (jsonData.data) ? (jsonData.data) : ([]);

            resolve(tmpData);
          }).catch(err => {
            resolve([]);
          });
      }
    });
  }

  const getRightAndIsrcData = (type, val) => {
    setViewLoading(true);

    getRightData((type == 'songCode') ? val : songIdCode).then((rightRes) => {
      let tmpRightRes = [];

      if (rightRes) {
        tmpRightRes = rightRes.filter((elem) => elem.contract_song_id && elem.default_settle_company == '1').map((elem) => ({
          ...elem,
          rights_type: elem.song_right_type,
          rights_ratio: elem.song_right_ratio,
          name: elem.author_pen_name,
          song_right_type_name: elem.rights_type,
          commission_id: '',
          ui_split_opt: [],
        }));
      }

      setSongTable(tmpRightRes);

      setViewLoading(false);
    });

    setIsrcId('');
    getIsrcData((type == 'songCode') ? val : songIdCode).then((res) => {
      setIsrcList(res ? res : []);
    });
    setRecordTable([]);
  }

  const getContractAuthorSplitData = (contract_author_id) => {
    return new Promise((resolve, reject) => {
      let contractid = (contract_author_id) ? (contract_author_id) : '';

      fetch(`${window.FRONTEND_WEB}/contract_author?contract_author_id=${contractid}`)
        .then(res => res.json())
        .then(jsonData => {
          let opts = [];

          if (jsonData.data && jsonData.data.split_information) {
            for (let i = 0; i < jsonData.data.split_information.length; i++) {
              let splitItem = jsonData.data.split_information[i];
              let typeNameList = ['CD', 'DVD', '卡帶', '黑膠', '數位-Vocal', '數位-Video', '營業用單曲', '明星商品', '書籍', '電子書', '其他', '特殊'];
              let typeId = parseInt(splitItem.contract_author_split_item_id);
              let tmpLabel = '';

              if (!splitItem.id) {
                continue;
              }

              if (!isNaN(typeId) && typeId >= 1 && typeId <= 12) {
                tmpLabel = typeNameList[typeId - 1];
              }

              if (splitItem.is_specified_country == '0') {
                tmpLabel += '-其他地區';
              } else if (splitItem.is_specified_country == '1' && splitItem.country && splitItem.country.country_name_zh) {
                tmpLabel += `-${splitItem.country.country_name_zh}`;
              }

              opts.push({ value: splitItem.id, label: tmpLabel });
            }
          }

          resolve(opts)
        }).catch(err => {
          resolve([]);
        });
    });
  }

  // ui -----
  const handleRefEdit = () => {
    refEdit.current = true;
  }

  const handleType = (val) => {
    if (val == '1') {
      refType1_1.current.style.display = 'flex';
      refType1_2.current.style.display = 'flex';
      refType1_3.current.style.display = 'flex';
      refType2_1.current.style.display = 'none';
      refType2_2.current.style.display = 'none';
    } else {
      refType1_1.current.style.display = 'none';
      refType1_2.current.style.display = 'none';
      refType1_3.current.style.display = 'none';
      refType2_1.current.style.display = 'flex';
      refType2_2.current.style.display = 'flex';
    }

    setType(val);
  }

  const isrcSelect = () => {
    return (
      <Select
        style={{ width: '100%' }}
        options={isrcList}
        value={isrcId}
        onChange={(val) => {
          handleRefEdit();
          setViewLoading(true);
          setIsrcId(val);
          getIsrcSplitData(val).then((res) => {
            setRecordTable((prev) => {
              let tmpRecordTable = res ? (res.map((elem) => ({ ...elem, isrc_split_id: elem.id, name: elem.author_name, ui_split_opt: [] }))) : ([]);
              return tmpRecordTable;
            });
            setViewLoading(false);
          });
        }}
        onFocus={() => {
          getIsrcData(songIdCode).then((res) => {
            setIsrcList(res ? res : []);
          });
        }}
      />
    );
  }

  const songTableSelectUiSplitOpt = (elem, sIdx) => {
    return (
      <Select
        style={{ minWidth: '150px' }}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        options={(elem.ui_split_opt) ? (elem.ui_split_opt) : ([])}
        value={elem.commission_id}
        onChange={(value, option) => {
          handleRefEdit();
          setSongTable((prev) => {
            let tmpSongTable = prev.slice();
            tmpSongTable[sIdx].commission_id = value;
            return tmpSongTable;
          });
        }}
        onFocus={() => {
          setIsFetching(true);
          getContractSplitData(songTable[sIdx].contract_song_id).then((result) => {
            setSongTable((prev) => {
              let tmpSongTable = prev.slice();
              tmpSongTable[sIdx].ui_split_opt = result;
              return tmpSongTable;
            });

            setIsFetching(false);
          });
        }}
      />
    );
  }

  const recordTableSelectUiSplitOpt = (elem, rIdx) => {
    return (
      <Select
        style={{ minWidth: '150px' }}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        options={(elem.ui_split_opt) ? (elem.ui_split_opt) : ([])}
        value={elem.commission_id}
        onChange={(value) => {
          handleRefEdit();
          setRecordTable((prev) => {
            let tmpRecordTable = prev.slice();
            tmpRecordTable[rIdx].commission_id = value;
            return tmpRecordTable;
          });
        }}
        onFocus={() => {
          setIsFetching(true);
          getContractAuthorSplitData(elem.contract_author_id).then((result) => {
            setRecordTable((prev) => {
              let tmpRecordTable = prev.slice();
              tmpRecordTable[rIdx].ui_split_opt = result;
              return tmpRecordTable;
            });

            setIsFetching(false);
          });
        }}
      />
    );
  }

  return (
    <div ref={refDelete}>
      <Form
        layout="vertical"
      >
        <Row gutter={[64, 24]}>
          <Col
            xs={24}
            style={{ paddingTop: '15px', paddingBottom: '15px' }}
          >
            <div
              style={{ borderBottom: '3px solid #87B067', width: '100%', height: '35px' }}
            >
              <span
                style={{ display: 'inline-block', textAlign: 'center', color: '#fff', minWidth: '100px', backgroundColor: '#87B067', padding: '5px', float: 'left' }}
              >
                {parentIdx + 1}
              </span>
              <div style={{ marginLeft: '50%', textAlign: 'right' }}>
                <span
                  ref={refSoldDateHint}
                  className={styles.om_color_red}
                >
                  銷售日期改變，請重新整理&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <Tooltip title="重新整理">
                  <FileSyncOutlined
                    className={`${styles.om_icon_style}  ${styles.om_color_link_blue}`}
                    type="link"
                    onClick={() => {
                      refSoldDateHint.current.style.display = 'none';
                      handleRefEdit();
                      setViewLoading(true);

                      // 歌曲, pack
                      commFn.searchOption((contractAuthorUiIdName && contractAuthorUiIdName.keyword) ? (contractAuthorUiIdName.keyword) : (''), '/contract_misc/contracts_author_by_code', (res) => {
                        let tmpRes = [];

                        if (res && contractAuthorUiId) {
                          res = res.filter((elem) => elem.contract_author && elem.contract_author.is_delete == '0');
                          tmpRes = res.map((elem) => ({
                            ui_id: `${elem.contract_author.id}_${(elem.subcontract_id) ? (elem.subcontract_id) : ''}`,
                            id: elem.contract_author.id,
                            contract_code: elem.contract_author.contract_code,
                            subcontract_id: elem.subcontract_id,
                            subcontract_code: elem.subcontract_code,
                            subcontract_parent_author_name: elem.subcontract_parent_author_name,
                            subcontract_author_name: elem.subcontract_author_name,
                            settle_company_name: (elem.settle_company_name) ? (elem.settle_company_name) : null,
                          }));
                          tmpRes = tmpRes.filter((elem) => elem.ui_id == contractAuthorUiId);
                        }

                        setContractAuthorList(tmpRes);
                        if (tmpRes.length > 0) {
                          let tmpItem = tmpRes[0];

                          setContractAuthorUiIdName({
                            keyword: (tmpItem.subcontract_code) ? (tmpItem.subcontract_code) : (tmpItem.contract_code),
                            contract_code: tmpItem.contract_code,
                            subcontractcode: tmpItem.subcontract_code,
                          });

                          setContractAuthorPartyB(
                            (tmpItem.settle_company_name)
                              ? (tmpItem.settle_company_name)
                              : (
                                (tmpItem.subcontract_author_name)
                                  ? (tmpItem.subcontract_author_name)
                                  : (
                                    (tmpItem.subcontract_parent_author_name)
                                      ? (tmpItem.subcontract_parent_author_name)
                                      : ('')
                                  )
                              )
                          );
                        } else {
                          setContractAuthorUiId('');
                          setContractAuthorUiIdName({
                            keyword: '',
                            contract_code: '',
                            subcontractcode: '',
                          });
                          setContractAuthorPartyB('');
                        }

                        setPackTable((prev) => {
                          let tmpPackTable = { ...prev };
                          tmpPackTable.commission_id = '';
                          tmpPackTable.ui_split_opt = [];
                          return tmpPackTable;
                        });

                        getRightAndIsrcData();
                      }, [{ key: 'release_date', value: soldDate }]);

                    }}
                  />
                </Tooltip>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Tooltip title="複製內容">
                  <CopyOutlined
                    className={`${styles.om_icon_style}  ${styles.om_color_link_blue}`}
                    onClick={() => {
                      let tmpContractAuthorIds = (contractAuthorUiId) ? (contractAuthorUiId.split('_')) : ([]);
                      let tmpIsrc = isrcList.filter((elem) => elem.value == isrcId);
                      let tmplyrics = [];
                      let tmpRecord = [];

                      // tmpIsrc
                      if (tmpIsrc.length > 0) {
                        tmpIsrc = tmpIsrc[0].label;
                      } else {
                        tmpIsrc = null;
                      }

                      // tmplyrics
                      if (type == '1') {
                        tmplyrics = songTable.map((elem) => {
                          let tmpSplitType = [];

                          if (elem.commission_id) {
                            tmpSplitType = elem.ui_split_opt.filter((tElem) => (tElem.value == elem.commission_id));
                          }

                          return ({
                            cmc_id: null,
                            song_right_id: elem.song_right_id,
                            contract_song_id: elem.contract_song_id,
                            isrc_split_id: elem.isrc_split_id,
                            isrc_ratio: elem.isrc_ratio,
                            contract_author_id: elem.contract_author_id,
                            commission_id: elem.commission_id,
                            author_id: elem.author_id,
                            name: elem.name,
                            split_type: (tmpSplitType[0] && tmpSplitType[0].label) ? (tmpSplitType[0].label) : null,
                            split_percent: elem.split_percent,
                            song_right_type_id: elem.song_right_id,
                            song_right_type_name: elem.song_right_type_name,
                            rights_ratio: elem.rights_ratio,
                          });
                        });
                      }

                      // recordTable, packTable
                      let tmpRecSplitType = [];
                      if (type == '1') {
                        tmpRecord = recordTable.map((elem) => {
                          tmpRecSplitType = [];

                          if (elem.commission_id) {
                            tmpRecSplitType = elem.ui_split_opt.filter((rElem) => (rElem.value == elem.commission_id));
                          }

                          return ({
                            cmc_id: null,
                            song_right_id: elem.song_right_id,
                            contract_song_id: elem.contract_song_id,
                            isrc_split_id: elem.isrc_split_id,
                            isrc_ratio: elem.isrc_ratio,
                            contract_author_id: elem.contract_author_id,
                            commission_id: elem.commission_id,
                            author_id: elem.author_id,
                            name: elem.name,
                            split_type: (tmpRecSplitType[0] && tmpRecSplitType[0].label) ? (tmpRecSplitType[0].label) : (null),
                            split_percent: elem.split_percent,
                          });
                        });
                      } else {
                        tmpRecSplitType = [];

                        if (packTable && packTable.commission_id) {
                          tmpRecSplitType = packTable.ui_split_opt.filter((pElem) => (pElem.value == packTable.commission_id));
                          tmpRecord.push({
                            cmc_id: null,
                            song_right_id: packTable.song_right_id,
                            contract_song_id: packTable.contract_song_id,
                            isrc_split_id: packTable.isrc_split_id,
                            isrc_ratio: packTable.isrc_ratio,
                            contract_author_id: packTable.contract_author_id,
                            commission_id: packTable.commission_id,
                            author_id: packTable.author_id,
                            name: packTable.name,
                            split_type: (tmpRecSplitType[0] && tmpRecSplitType[0].label) ? (tmpRecSplitType[0].label) : (null),
                            split_percent: packTable.split_percent,
                          })
                        }
                      }

                      addContent({
                        ui_new: true,
                        ui_sold_date_hint: (refSoldDateHint.current && refSoldDateHint.current.style.display == 'inline') ? (true) : (false),
                        name: name,
                        use_type_id: useTypeId,
                        type: type,
                        song_id: songId,
                        song_code: songIdCode,
                        song_name: songIdName,
                        distribution_format: distributionFormat,
                        contract_author_id: tmpContractAuthorIds[0],
                        contract_author_code: (contractAuthorUiIdName && contractAuthorUiIdName.contract_code) ? (contractAuthorUiIdName.contract_code) : (''),
                        contract_author_subcontract_id: tmpContractAuthorIds[1],
                        contract_author_subcontract_code: (contractAuthorUiIdName && contractAuthorUiIdName.subcontractcode) ? (contractAuthorUiIdName.subcontractcode) : (''),
                        flat_fee: refFlatFee.current.value,
                        syn_fee: refSynFee.current.value,
                        mech_flat_fee: refMechFlatFee.current.value,
                        mech_adv: null,
                        isrc_id: (type == '1') ? (isrcId) : null,
                        isrc: (type == '1') ? (tmpIsrc) : null,
                        amount: (type == '1') ? (recordAmount.current.value) : (packAmount.current.value),
                        notes: notes,
                        lyrics: tmplyrics,
                        record: tmpRecord,
                      });
                    }}
                  />
                </Tooltip>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Tooltip title="刪除內容">
                  <CloseOutlined
                    className={`${styles.om_icon_style} ${styles.om_color_red}`}
                    type="link"
                    onClick={() => {
                      refDelete.current.style.display = 'none';
                      refDelete.current.value = true;
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[64, 24]}>
          <Col xs={24} lg={8}>
            <Form.Item
              label="產品名稱"
              className={styles.addRequiredStar}
            >
              <Input
                value={name}
                onChange={(e) => {
                  handleRefEdit();
                  setName(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label="使用方式"
              className={styles.addRequiredStar}
            >
              <Select
                value={useTypeId}
                options={
                  (useTypeList.allList)
                    ? (useTypeList.allList.map((elem) => ({ value: elem.id, label: elem.name })))
                    : ([])
                }
                onChange={(val) => {
                  handleRefEdit();
                  setUseTypeId(val);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[64, 24]}>
          <Col xs={24} lg={8}>
            <Form.Item
              label="型態"
            >
              <input
                type="radio"
                id={`radio_type_song_${parentIdx}`}
                name={`radios_type_${parentIdx}`}
                value="1"
                checked={type == '1'}
                onChange={(e) => {
                  handleRefEdit();
                  handleType(e.currentTarget.value);
                }}
              />
              <label
                htmlFor={`radio_type_song_${parentIdx}`}
                style={{ padding: '0 16px 0 8px' }}
              >
                歌曲
            </label>
              <input
                type="radio"
                id={`radio_type_pack_${parentIdx}`}
                name={`radios_type_${parentIdx}`}
                value="2"
                checked={type == '2'}
                onChange={(e) => {
                  handleRefEdit();
                  handleType(e.currentTarget.value);
                }}
              />
              <label
                htmlFor={`radio_type_pack_${parentIdx}`}
                style={{ padding: '0 16px 0 8px' }}
              >
                pack
            </label>
            </Form.Item>
          </Col>
        </Row>
        {/* 歌曲 */}
        <Row
          gutter={[64, 24]}
          ref={refType1_1}
        >
          <FormSongId
            isVal={songId}
            setIsVal={setSongId}
            isList={songIdList}
            setIsList={setSongIdList}
            isCode={songIdCode}
            setIsCode={setSongIdCode}
            isName={songIdName}
            setIsName={setSongIdName}
            getRightAndIsrcData={getRightAndIsrcData}
            handleRefEdit={handleRefEdit}
          />
          <Col xs={24} lg={8}>
            <Form.Item
              label="權利型態"
              className={styles.addRequiredStar}
            >
              <input
                type="radio"
                id={`radios_distribution_format_entity_${parentIdx}`}
                name={`radios_distribution_format_${parentIdx}`}
                value="1"
                checked={distributionFormat == '1'}
                onChange={(e) => {
                  handleRefEdit();
                  setDistributionFormat(e.currentTarget.value);
                  getRightAndIsrcData();
                }}
              />
              <label
                htmlFor={`radios_distribution_format_entity_${parentIdx}`}
                style={{ padding: '0 16px 0 8px' }}
              >
                實體
            </label>
              <input
                type="radio"
                id={`radios_distribution_format_digital_${parentIdx}`}
                name={`radios_distribution_format_${parentIdx}`}
                value="2"
                checked={distributionFormat == '2'}
                onChange={(e) => {
                  handleRefEdit();
                  setDistributionFormat(e.currentTarget.value);
                  getRightAndIsrcData();
                }}
              />
              <label
                htmlFor={`radios_distribution_format_digital_${parentIdx}`}
                style={{ padding: '0 16px 0 8px' }}
              >
                數位
            </label>
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={[64, 24]}
          ref={refType1_2}
        >
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
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
                <tr>
                  <td className={styles.bottomPdTd}><p>{(songTable && songTable[0] && songTable[0].name) && songTable[0].name}</p></td>
                  <td><p>{(songTable && songTable[0] && songTable[0].song_right_type_name) && songTable[0].song_right_type_name}</p></td>
                  <td><p>{(songTable && songTable[0] && songTable[0].rights_ratio) && songTable[0].rights_ratio}</p></td>
                  <td>
                    {(songTable && songTable[0]) && (songTableSelectUiSplitOpt(songTable[0], 0))}
                  </td>
                  <td className={styles.bottomPdTd}><input type="number" ref={refFlatFee} style={inputNumberStyle} onChange={() => { handleRefEdit(); }} /></td>
                  <td className={styles.bottomPdTd}><input type="number" ref={refSynFee} style={inputNumberStyle} onChange={() => { handleRefEdit(); }} /></td>
                  <td className={styles.bottomPdTd}><input type="number" ref={refMechFlatFee} style={inputNumberStyle} onChange={() => { handleRefEdit(); }} /></td>
                </tr>
                {
                  (songTable && songTable.length > 0)
                  && (songTable.map((elem, sIdx) => {
                    if (sIdx == 0) {
                      return null;
                    }

                    return (
                      <tr key={`songTable_${sIdx}`}>
                        <td className={styles.bottomPdTd}><p>{elem.name}</p></td>
                        <td><p>{elem.song_right_type_name}</p></td>
                        <td><p>{elem.rights_ratio}</p></td>
                        <td>
                          {songTableSelectUiSplitOpt(elem, sIdx)}
                        </td>
                        <td className={styles.bottomPdTd}>&nbsp;</td>
                        <td className={styles.bottomPdTd}>&nbsp;</td>
                        <td className={styles.bottomPdTd}>&nbsp;</td>
                      </tr>
                    );
                  }))
                }
              </tbody>
            </table>
          </Col>
        </Row>
        <Row
          gutter={[64, 24]}
          ref={refType1_3}
        >
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            {/* record */}
            <br /><br />
            <p>錄音</p>
            <table className={styles.formTable}>
              <thead>
                <tr>
                  <th style={{ width: '200px' }}>ISRC</th>
                  <th>演唱人</th>
                  <th style={{ width: '200px' }}>拆分類型</th>
                  <th style={{ width: '100px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.bottomPdTd}>{isrcSelect()}</td>
                  <td><p>{(recordTable && recordTable[0] && recordTable[0].name) && recordTable[0].name}</p></td>
                  <td>
                    {(recordTable && recordTable[0]) && (recordTableSelectUiSplitOpt(recordTable[0], 0))}
                  </td>
                  <td className={styles.bottomPdTd}><input type="number" ref={recordAmount} style={inputNumberStyle} onChange={() => { handleRefEdit(); }} /></td>
                </tr>
                {
                  (recordTable && recordTable.length > 0)
                  && (
                    recordTable.map((elem, rIdx) => {
                      if (rIdx == 0) {
                        return null;
                      }

                      return (
                        <tr key={`recordTable_${rIdx}`}>
                          <td className={styles.bottomPdTd}><p>&nbsp;</p></td>
                          <td><p>{elem.name}</p></td>
                          <td>
                            {recordTableSelectUiSplitOpt(elem, rIdx)}
                          </td>
                          <td className={styles.bottomPdTd}>&nbsp;</td>
                        </tr>
                      );
                    })
                  )
                }
              </tbody>
            </table>
          </Col>
        </Row>
        {/* pack */}
        <Row
          gutter={[64, 24]}
          ref={refType2_1}
        >
          <Col xs={24} lg={8}>
            <FormContractAuthorId
              isVal={contractAuthorUiId}
              setIsVal={setContractAuthorUiId}
              isList={contractAuthorList}
              setIsList={setContractAuthorList}
              isName={contractAuthorUiIdName}
              setIsName={setContractAuthorUiIdName}
              soldDate={soldDate}
              setPackTable={setPackTable}
              setContractAuthorPartyB={setContractAuthorPartyB}
              handleRefEdit={handleRefEdit}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label=" "
            >
              <label>簽約對象：{contractAuthorPartyB}</label>
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={[64, 24]}
          ref={refType2_2}
        >
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <table className={styles.formTable}>
              <thead>
                <tr>
                  <th style={{ width: '200px' }}>ISRC</th>
                  <th>演唱人</th>
                  <th style={{ width: '200px' }}>拆分類型</th>
                  <th style={{ width: '100px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.bottomPdTd}><p>-</p></td>
                  <td><p>-</p></td>
                  <td>
                    <Select
                      style={{ minWidth: '150px' }}
                      notFoundContent={isFetching ? <Spin size="small" /> : null}
                      options={(packTable.ui_split_opt) ? (packTable.ui_split_opt) : ([])}
                      value={packTable.commission_id}
                      onChange={(value) => {
                        handleRefEdit();
                        setPackTable((prev) => {
                          let tmpPackTable = { ...prev };
                          tmpPackTable.commission_id = value;
                          return tmpPackTable;
                        });
                      }}
                      onFocus={() => {
                        setIsFetching(true);
                        let tmpContractAuthorId = contractAuthorUiId.split('_');
                        tmpContractAuthorId = (tmpContractAuthorId[0]) ? (tmpContractAuthorId[0]) : ('');

                        getContractAuthorSplitData(tmpContractAuthorId).then((result) => {
                          setPackTable((prev) => {
                            let tmpPackTable = { ...prev };
                            tmpPackTable.ui_split_opt = result;
                            return tmpPackTable;
                          });

                          setIsFetching(false);
                        });
                      }}
                    />
                  </td>
                  <td className={styles.bottomPdTd}><input type="number" ref={packAmount} style={inputNumberStyle} onChange={() => { handleRefEdit(); }} /></td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row
          gutter={[64, 24]}
        >
          <Col xs={24} lg={8}>
            <br /><br />
            <Form.Item
              label="備註"
            >
              <TextArea
                rows={4}
                value={notes}
                onChange={(e) => {
                  setNotes(e.currentTarget.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default connect(({ useTypeList, miscList }) => ({
  useTypeList,
  miscList,
}))(ComContent);