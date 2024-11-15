import React, { useState } from 'react';
import {
  Form,
  InputNumber,
  Input,
  Button,
  Select,
  Spin,
} from 'antd';
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

const FormSongSeq = props => {
  const {
    form,
    songCodeList,
    setSongCodeList,
    isrcList,
    setIsrcList,
    uiIsSettled,
    setUiIsSettled,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;
  let timerIsrc;
  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Song', (res) => {
        let tmpSongCodeList = songCodeList.slice();

        tmpSongCodeList[idx] = res;
        setSongCodeList(tmpSongCodeList);
        setIsFetching(false);
      });
    }, 200);
  }

  const searchIsrcOption = (keyword, idx) => {
    if (keyword) {
      fetch(`${window.FRONTEND_WEB}/song/detail_isrc?song_code=${keyword}`).then(
        res => res.json()
      ).then(opts => {
        let arrSongList = form.getFieldsValue().song_list;
        let tmpIsrcList = isrcList.slice();

        if (opts.data && opts.data.data_list && opts.data.data_list.length > 0) {
          tmpIsrcList[idx] = opts.data.data_list.map((elem) => ({ ...elem, value: elem.isrc, label: elem.isrc }));
          arrSongList[idx].isrc = opts.data.data_list[0].isrc;
          arrSongList[idx].singer = opts.data.data_list[0].singer;
          arrSongList[idx].format_length = opts.data.data_list[0].length;
          arrSongList[idx].isrc_type = opts.data.data_list[0].isrc_type;
        } else {
          tmpIsrcList[idx] = [];
          arrSongList[idx].isrc = '';
          arrSongList[idx].singer = '';
          arrSongList[idx].format_length = '';
          arrSongList[idx].isrc_type = '';
        }

        setIsrcList(tmpIsrcList);
        form.setFieldsValue({ song_list: arrSongList });
      }).catch(err => {
        let arrSongList = form.getFieldsValue().song_list;
        let tmpIsrcList = isrcList.slice();

        tmpIsrcList[idx] = [];
        setIsrcList(tmpIsrcList);
        arrSongList[idx].isrc = '';
        arrSongList[idx].singer = '';
        arrSongList[idx].format_length = '';
        arrSongList[idx].isrc_type = '';
        form.setFieldsValue({ song_list: arrSongList });
      });
    } else {
      let arrSongList = form.getFieldsValue().song_list;
      let tmpIsrcList = isrcList.slice();

      tmpIsrcList[idx] = [];
      setIsrcList(tmpIsrcList);
      arrSongList[idx].isrc = '';
      arrSongList[idx].singer = '';
      arrSongList[idx].format_length = '';
      arrSongList[idx].isrc_type = '';
      form.setFieldsValue({ song_list: arrSongList });
    }
  }

  return (
    <Form.List name="song_list">
      {(fields, { add, remove }) => {
        let arr = form.getFieldValue().song_list;
        let num = 0;

        return (
          <table
            id="song_table"
            className={styles.formTable}
          >
            <thead>
              <tr>
                <th style={{ width: '80px' }}>曲序</th>
                <th style={{ width: '300px' }}>歌名</th>
                <th style={{ width: '200px' }}>ISRC</th>
                <th>演唱人</th>
                <th>秒數</th>
                <th>型態</th>
                <th style={{ width: '100px' }}>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => {
                if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined || arr[idx]['is_delete'] == '0') {
                  num++;
                }

                return (
                  <tr
                    key={`tr_song_${field.key}`}
                    style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined || arr[idx]['is_delete'] == '0') ? {} : { display: 'none' }}
                  >
                    <td>
                      <Form.Item
                        {...field}
                        name={[field.name, 'song_seq']}
                        fieldKey={[field.fieldKey, 'song_seq']}
                        key={`song_seq_${field.fieldKey}`}
                        rules={[
                          {
                            validator(rule, values, callback) {
                              let result = true;
                              let arrSongList = form.getFieldsValue().song_list;

                              if (!arrSongList[idx].is_delete || arrSongList[idx].is_delete == '0') {
                                result = valid.checkRequired(values);
                              }

                              if (result != false) {
                                callback();
                              } else {
                                callback(valid.checkRequired_msg);
                              }
                            }
                          },
                          {
                            validator(rule, values, callback) {
                              let result = true;
                              let arrSongList = form.getFieldsValue().song_list;

                              if (values && (!arrSongList[idx].is_delete || arrSongList[idx].is_delete == '0')) {
                                result = valid.checkPostiveInt(values);
                              }

                              if (result != false) {
                                callback();
                              } else {
                                callback(valid.checkPostiveInt_msg);
                              }
                            }
                          },
                          {
                            validator(rule, values, callback) {
                              let result = true;
                              let arrSongList = form.getFieldsValue().song_list;

                              if (values && (!arrSongList[idx].is_delete || arrSongList[idx].is_delete == '0')) {
                                for (let i = 0; i < arrSongList.length; i++) {
                                  if (arrSongList[i].is_delete && arrSongList[i].is_delete == '1') {
                                    continue;
                                  }
                                  if (i != idx && arrSongList[i].song_seq && values == arrSongList[i].song_seq) {
                                    result = false;
                                    break;
                                  }
                                }
                              }

                              if (result) {
                                callback();
                              } else {
                                callback('欄位不可重複');
                              }
                            }
                          }
                        ]}
                      >
                        <Input
                          onChange={() => {
                            let arrAddEdit = form.getFieldsValue().song_list.slice();
                            arrAddEdit[idx]['is_edit'] = '1';
                            form.setFieldsValue({ song_list: arrAddEdit });
                          }}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item
                        {...field}
                        name={[field.name, 'song_code']}
                        fieldKey={[field.fieldKey, 'song_code']}
                        key={`song_code_${field.fieldKey}`}
                        validateTrigger={['onClick', 'onBlur']}
                        initialValue=""
                        rules={[
                          {
                            validator(rule, values, callback) {
                              let result = true;
                              let arrSongList = form.getFieldsValue().song_list;

                              if (!arrSongList[idx].is_delete || arrSongList[idx].is_delete == '0') {
                                result = valid.checkRequired(values);
                              }

                              if (result != false) {
                                callback();
                              } else {
                                callback(valid.checkRequired_msg);
                              }
                            }
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          filterOption={false}
                          allowClear={true}
                          disabled={(uiIsSettled[idx]) ? (true) : (false)}
                          notFoundContent={isFetching ? <Spin size="small" /> : null}
                          onSearch={(value) => {
                            searchOption(value, idx);
                          }}
                          onChange={(value, option) => {
                            let arrAddEdit = form.getFieldsValue().song_list.slice();
                            let tmpSongCodeList = songCodeList.slice();

                            if (!value) {
                              arrAddEdit[idx]['song_name'] = '';
                              arrAddEdit[idx]['isrc'] = '';
                              arrAddEdit[idx]['singer'] = '';
                              arrAddEdit[idx]['format_length'] = '';
                              arrAddEdit[idx]['isrc_type'] = '';

                              tmpSongCodeList[idx] = [];
                              setSongCodeList(tmpSongCodeList);
                              searchIsrcOption('', idx);
                            } else {
                              searchIsrcOption(arrAddEdit[idx].song_code, idx);
                            }

                            arrAddEdit[idx]['is_edit'] = '1';
                            arrAddEdit[idx]['is_delete'] = '0';
                            form.setFieldsValue({ song_list: arrAddEdit });
                          }}
                          onFocus={() => {
                            let tmpSongCodeList = songCodeList.slice();

                            tmpSongCodeList[idx] = [];
                            setSongCodeList(tmpSongCodeList);
                            if (form.getFieldValue()['song_list'][idx]['song_name']) {
                              searchOption(form.getFieldValue()['song_list'][idx]['song_name'], idx);
                            }
                          }}
                          onSelect={(value, option) => {
                            searchOption(option.label, idx);
                          }}
                        >
                          {
                            (songCodeList && songCodeList[idx])
                              ? (
                                songCodeList[idx].map(d => (
                                  <Option
                                    key={d.song_code}
                                    label={d.song_name}
                                    text={d.song_code}
                                    showtext={`${d.song_name} (${d.song_code})`}
                                  >
                                    {`${d.song_name} (${d.song_code})`}
                                  </Option>
                                ))
                              )
                              : ([])
                          }
                        </Select>
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item
                        {...field}
                        name={[field.name, 'isrc']}
                        fieldKey={[field.fieldKey, 'isrc']}
                        key={`isrc_${field.fieldKey}`}
                        rules={[
                          {
                            validator(rule, values, callback) {
                              let result = true;
                              let arrSongList = form.getFieldsValue().song_list;

                              if (!arrSongList[idx].is_delete || arrSongList[idx].is_delete == '0') {
                                result = valid.checkRequired(values);
                              }

                              if (result != false) {
                                callback();
                              } else {
                                callback(valid.checkRequired_msg);
                              }
                            }
                          },
                        ]}
                      >
                        <Select
                          disabled={(uiIsSettled[idx]) ? (true) : (false)}
                          options={isrcList[idx]}
                          onChange={(value, option) => {
                            let arrSongList = form.getFieldsValue().song_list;

                            arrSongList[idx]['singer'] = option.singer;
                            arrSongList[idx]['format_length'] = option.length;
                            arrSongList[idx]['isrc_type'] = option.isrc_type;
                            arrSongList[idx]['is_edit'] = '1';
                            form.setFieldsValue({ song_list: arrSongList });
                          }}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item shouldUpdate>
                        {() => {
                          let arrSongList = form.getFieldsValue().song_list;
                          return (arrSongList && arrSongList[idx] && arrSongList[idx].singer) ? arrSongList[idx].singer : '';
                        }}
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item shouldUpdate>
                        {() => {
                          let arrSongList = form.getFieldsValue().song_list;
                          return (arrSongList && arrSongList[idx] && arrSongList[idx].format_length) ? arrSongList[idx].format_length : '';
                        }}
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item shouldUpdate>
                        {() => {
                          let arrSongList = form.getFieldsValue().song_list;
                          return (arrSongList && arrSongList[idx] && arrSongList[idx].isrc_type) ? arrSongList[idx].isrc_type : '';
                        }}
                      </Form.Item>
                    </td>
                    <td className={styles.om_td_icon_style}>
                      <Form.Item shouldUpdate>
                        {
                          (uiIsSettled[idx])
                            ? ('(已結算)')
                            : (
                              <Button
                                type="link"
                                onClick={() => {
                                  if (arr[idx] === undefined || arr[idx]['album_disc_content_id'] === undefined) {
                                    let tmpUiIsSettled = uiIsSettled.slice();
                                    tmpUiIsSettled.splice(idx, 1);
                                    setUiIsSettled(tmpUiIsSettled);

                                    let tmpSongCodeList = songCodeList.slice();
                                    tmpSongCodeList.splice(idx, 1);
                                    setSongCodeList(tmpSongCodeList);

                                    let tmpIsrcList = isrcList.slice();
                                    tmpIsrcList.splice(idx, 1);
                                    setIsrcList(tmpIsrcList);

                                    remove(field.name);
                                  } else {
                                    let arrDel = form.getFieldValue().song_list.slice();
                                    arrDel[idx]['is_delete'] = '1';
                                    form.setFieldsValue({ song_list: arrDel });
                                  }
                                }}
                              >
                                <CloseOutlined
                                  className={`${styles.om_icon_btn_style} ${styles.om_color_red}`}
                                />
                              </Button>
                            )
                        }

                      </Form.Item>
                    </td>
                  </tr>
                )
              })}
              <tr className={styles.lastTr}>
                <td colSpan="7">
                  <Button
                    type="dashed"
                    block
                    onClick={() => { add(); }}
                  >
                    <PlusOutlined />新增曲目
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        )
      }}
    </Form.List>
  );
}

export default FormSongSeq;