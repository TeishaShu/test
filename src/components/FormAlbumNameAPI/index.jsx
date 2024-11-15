import React, { Fragment, useState } from 'react';
import {
  Form,
  Select,
  Input,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormAlbumNameAPI = props => {
  const {
    form,
    isLabel,
    isName,  // db: album.id
    isSelectText,
    isList,
    setIsList,
    isDisabled,
    changeFn,  // optional
    isRules,  // optional
    isCode,  // optional
    setIsCode,  // optional
    hideCode,  // optional,
    formStyle,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/album', (res) => {
        setIsList(res);
        setIsFetching(false);
      }, [{ key: 'precise', value: '0' }]);
    }, 200);
  }

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
        rules={isRules}
      >
        <Select
          style={formStyle}
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={false}
          allowClear={true}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          disabled={(isDisabled) ? (isDisabled) : false}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            let obj = {};

            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
              if (setIsCode) {
                setIsCode('');
              }
            }

            if (changeFn) {
              changeFn(value, option);
            }

            if (option) {
              obj[isSelectText] = option.label;
              obj['album_code'] = option.albumcode;
              form.setFieldsValue(obj);
              if (setIsCode) {
                setIsCode(option.albumcode);
              }
            } else {
              obj[isSelectText] = '';
              obj['album_code'] = '';
              form.setFieldsValue(obj);
              if (setIsCode) {
                setIsCode('');
              }
            }
          }}
          onFocus={() => {
            setIsList([]);
            searchOption(form.getFieldValue()[isSelectText]);
          }}
          onSelect={(value, option) => {
            searchOption(option.label);
          }}
        >
          {isList.map(d => (
            <Option
              key={d.id}
              label={d.album_name_zh}
              albumcode={d.album_code}
              author={d.author}
              typeid={d.type_id}
              releasecountry={d.release_country}
              releasecompany={d.release_company}
              songcount={d.song_count}
            >
              {`${d.album_name_zh} (${d.album_code} | ${d.release_country})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {
        (isCode && !hideCode) && (
          <label className={styles.searchLabel}>{(isCode) ? `(${isCode})` : ''}</label>
        )
      }
    </Fragment >
  );
}

export default FormAlbumNameAPI;