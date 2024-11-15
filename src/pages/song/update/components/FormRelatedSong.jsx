import React, { useState } from 'react';
import {
  Form,
  InputNumber,
  Select,
  Button,
  Tooltip,
  Spin,
} from 'antd';
import { Link } from 'umi';
import { PlusOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import cusStyles from '@/pages/song/style/index.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

const FormRelatedSong = props => {
  const {
    form,
    songCodeList,
    setSongCodeList,
    isSongCategoryId,
    isSongNum,
    isSongPercent,
    changeSongInfo
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/song', (res) => {
        let tmpSongCodeList = songCodeList.slice();

        tmpSongCodeList[idx] = res;
        setSongCodeList(tmpSongCodeList);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Form.List name="origin_list">
      {(fields, { add, remove }) => {
        let arr = form.getFieldValue().origin_list;
        let num = 0;

        return (
          <table
            id="song_table"
            className={styles.formTable}
          >
            <thead>
              <tr>
                <th>歌曲名稱</th>
                <th>歌曲編號</th>
                <th>百分比</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => {
                if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined || arr[idx]['is_delete'] == '0') {
                  num++;
                }

                return (
                  <tr
                    key={`tr_song_code_${field.key}`}
                    style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined || arr[idx]['is_delete'] == '0') ? {} : { display: 'none' }}
                  >
                    <td>
                      <Form.Item
                        {...field}
                        name={[field.name, 'song_code']}
                        fieldKey={[field.fieldKey, 'song_code']}
                        key={`song_code_${field.fieldKey}`}
                        validateTrigger={['onClick', 'onBlur']}
                        rules={[
                          {
                            validator(rule, values, callback) {
                              let result = (form.getFieldValue().origin_list[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

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
                              let arrOriginList = form.getFieldsValue().origin_list;

                              if (values && (!arrOriginList[idx].is_delete || arrOriginList[idx].is_delete == '0')) {
                                for (let i = 0; i < arrOriginList.length; i++) {
                                  if (arrOriginList[i].is_delete && arrOriginList[i].is_delete == '1') {
                                    continue;
                                  }
                                  if (i != idx && arrOriginList[i].song_code && values == arrOriginList[i].song_code) {
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
                        <Select
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          filterOption={false}
                          allowClear={true}
                          notFoundContent={isFetching ? <Spin size="small" /> : null}
                          onSearch={(value) => {
                            searchOption(value, idx);
                          }}
                          onChange={(value) => {
                            let arrAddEdit = form.getFieldsValue().origin_list.slice();
                            let tmpSongCodeList = songCodeList.slice();

                            if (!value) {
                              arrAddEdit[idx]['song_name'] = '';

                              tmpSongCodeList[idx] = [];
                              setSongCodeList(tmpSongCodeList);
                            }

                            arrAddEdit[idx]['is_edit'] = '1';
                            arrAddEdit[idx]['is_delete'] = '0';
                            form.setFieldsValue({ origin_list: arrAddEdit });
                          }}
                          onFocus={() => {
                            let tmpSongCodeList = songCodeList.slice();

                            tmpSongCodeList[idx] = [];
                            setSongCodeList(tmpSongCodeList);
                            if (form.getFieldValue()['origin_list'][idx]['song_name']) {
                              searchOption(form.getFieldValue()['origin_list'][idx]['song_name'], idx);
                            }
                          }}
                          onSelect={(value, option) => {
                            searchOption(option.label, idx);
                          }}
                        >
                          {
                            (songCodeList && songCodeList[idx])
                              ? (
                                songCodeList[idx].filter(d => d.song_category_id == '1' || !d.song_category_id).map(d => (
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
                      <Form.Item shouldUpdate>
                        {() => {
                          let arrOriginList = form.getFieldsValue().origin_list;
                          return (arrOriginList[idx] && arrOriginList[idx].song_code) ? arrOriginList[idx].song_code : '';
                        }}
                      </Form.Item>
                    </td>
                    <td width="200">
                      <Form.Item
                        {...field}
                        name={[field.name, 'related_song_ratio']}
                        fieldKey={[field.fieldKey, 'related_song_ratio']}
                        key={`related_song_ratio_${field.fieldKey}`}
                        initialValue=""
                        rules={[
                          {
                            validator(rule, values, callback) {
                              let result = (form.getFieldValue().origin_list[idx]['is_delete'] == '1') ? (true) : valid.checkPostiveNumberAndZero(values);
                              if (!result) {
                                callback(valid.checkPostiveNumberAndZero_msg);
                              } else {
                                callback();
                              }
                            }
                          }
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          onChange={() => {
                            let arrAddEdit = form.getFieldsValue().origin_list.slice();

                            arrAddEdit[idx]['is_edit'] = '1';
                            arrAddEdit[idx]['is_delete'] = '0';
                            form.setFieldsValue({ origin_list: arrAddEdit });
                          }}
                        />
                      </Form.Item>
                    </td>
                    <td className={styles.om_td_icon_style}>
                      <Form.Item shouldUpdate>
                        {() => {
                          let arrOriginList = form.getFieldsValue().origin_list;
                          return (
                            (arrOriginList[idx] && arrOriginList[idx].song_code) ?
                              (
                                <Link
                                  to={`/song/adv/song_code/${arrOriginList[idx].song_code}`}
                                  target="_blank"
                                >
                                  <Tooltip title="查看歌曲">
                                    <EyeOutlined className={styles.om_icon_btn_style} />
                                  </Tooltip>
                                </Link>
                              ) :
                              (<EyeOutlined className={styles.om_icon_btn_style} />)
                          );
                        }}
                      </Form.Item>
                    </td>
                    <td className={styles.om_td_icon_style}>
                      <Form.Item>
                        <Button
                          type="link"
                          onClick={() => {
                            if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                              remove(field.name);
                            } else {
                              let arrDel = form.getFieldValue().origin_list.slice();
                              arrDel[idx]['is_delete'] = '1';
                              form.setFieldsValue({ origin_list: arrDel });
                            }
                            changeSongInfo();
                          }}
                        >
                          <CloseOutlined
                            className={`${styles.om_icon_btn_style} ${styles.om_color_red}`}
                          />
                        </Button>
                      </Form.Item>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="2">
                  <Form.Item shouldUpdate>
                    曲數：{isSongNum}
                  </Form.Item>
                </td>
                <td colSpan="3" className={(isSongPercent > 100) ? cusStyles.percent_red : ''}>
                  <Form.Item>
                    百分比加總：{isSongPercent}
                  </Form.Item>
                </td>
              </tr>
              <tr
                style={{ display: ((isSongCategoryId == '2' && isSongNum < 1) || isSongCategoryId == '3' || isSongCategoryId == '4') ? 'table-row' : 'none' }}
                className={styles.lastTr}
              >
                <td colSpan="5">
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
        );
      }}
    </Form.List>
  );
}

export default FormRelatedSong;