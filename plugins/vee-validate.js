/* eslint-disable camelcase */
import { extend } from 'vee-validate'
import {
  alpha_spaces,
  alpha_num,
  confirmed,
  email,
  ext,
  length,
  max,
  max_value,
  min,
  min_value,
  numeric,
  required,
  required_if,
  regex,
  size,
} from 'vee-validate/dist/rules'

// const validUsernamePattern = /^[a-zA-Z0-9.\-_]{3,20}$/;

extend('alpha_spaces', {
  ...alpha_spaces,
  message: 'This field must only contain alphabetic characters',
})

extend('alpha_num', {
  ...alpha_num,
  message: "We're looking for a-z and 0-9 here.",
})

extend('confirmed', confirmed)

extend('email', {
  ...email,
  message: 'This email is invalid',
})

extend('length', length)

extend('max', {
  ...max,
  message: 'This field must be less than {length} characters',
})

extend('max_value', {
  ...max_value,
  message: 'This field must be less than {length}',
})

extend('min', {
  ...min,
  message: 'This field must have at least {length} characters',
})

extend('min_value', {
  ...min_value,
  message: 'This field must have at least {length}',
})

extend('numeric', numeric)

extend('required', {
  ...required,
  message: 'This field is required',
})

extend('required_if', required_if)

extend('regex', {
  ...regex,
  message: 'This expression is invalid.',
})

extend('checked', {
  validate(value) {
    return value
  },
  message: 'This field must be checked',
})

extend('extAudio', {
  ...ext,
  message: 'This file is invalid. Valid extensions are: mp3, ogg, wav, flac',
})

extend('extImage', {
  ...ext,
  message: 'This file is invalid. Valid extensions are: png, jpeg, jpg',
})

extend('size10MB', {
  ...size,
  message: `Maximum allowed file size is 10MB`,
})

extend('extPictureAndGif', {
  ...ext,
  message: 'This file is invalid. Valid extensions are: png, jpg, jpeg, gif',
})
