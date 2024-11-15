import React, { useState, Fragment } from 'react';
import {
  Form,
  AutoComplete,
  Spin,
  Select,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

const FormSongId = props => {
  const {
    form,
    isList,
    setIsList,
    idx,
    getUiSongData,
  } = props;

  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/song', (res) => {
        let tmpIsList = isList.slice();

        tmpIsList = res;
        setIsList(tmpIsList);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Form.Item
      label="歌曲名稱"
      className={styles.addRequiredStar}
      name="song_id"
      validateTrigger={['onClick', 'onBlur']}
      rules={[
        {
          validator(rule, values, callback) {
            let result = true;

            if (form.getFieldValue().type == '1') {
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
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        onSearch={(value) => {
          searchOption(value);
        }}
        onChange={(value, option) => {
          let tmpSongName = '';
          let tmpSongCode = '';

          if (value) {
            tmpSongName = option.label;
            tmpSongCode = option.text;
          }

          form.setFieldsValue({
            is_edit: '1',
            song_name: tmpSongName,
            song_code: tmpSongCode,
          });

          getUiSongData((option && option.text) ? (option.text) : (''));
        }}
        onFocus={() => {
          if (form.getFieldValue()['song_name']) {
            searchOption(form.getFieldValue()['song_name']);
          }
        }}
        onSelect={(value, option) => {
          searchOption(option.label);
        }}
      >
        {
          (isList)
            ? (
              isList.map(d => (
                <Option
                  key={d.id}
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
  )
}

export default FormSongId;