import * as Yup from 'yup';


export const requiredRule = (t: any) => Yup.string().required(t('core.formValidatorMessages.required'))
export const optionalRule = () => Yup.string().optional()

export const passwordRestrictionRule = (t: any, min: number = 8) => Yup.string()
    .required(t('core.formValidatorMessages.required'))
    .min(min, t('core.formValidatorMessages.password'))

export const emailRule = (t: any) => Yup.string().required(t('core.formValidatorMessages.required')).email(t('core.formValidatorMessages.email'))
export const arrayLatestRule = (t: any, min: number = 1) => Yup.array().min(min, t('core.formValidatorMessages.minArray')).required(t('core.formValidatorMessages.required'))
export const fileImageRule = (t: any) => Yup.mixed()
    .required(t('core.formValidatorMessages.required'))
    .test('is-file-or-url', (value: any, { createError }) => {
        if (value instanceof File) {
            const valid = true
            if (!(value && value.size <= 1024 * 1024 * 5)) return createError({
                message: t('core.formValidatorMessages.avatarMaxSize')
            })

            if (!(value && ['image/jpeg', 'image/png', 'image/png'].includes(value.type))) return createError({
                message: t('core.formValidatorMessages.avatarUpload')
            })
            return valid
        }
        if (typeof value === 'string') {
            try {
                new URL(value);
                return true;
            } catch {
                return createError({
                    message: 'Must be a valid URL (e.g., https://example.com/file.pdf)'
                });
            }
        }

        return createError({
            message: 'Input must be either a file or a URL string'
        })
    })

export const ratioLogRule = (t: any) => Yup.number()
    .required(t('core.formValidatorMessages.required'))
    .min(201, t('core.formValidatorMessages.min') + 201)
    .max(1000, t('core.formValidatorMessages.max') + 1000)

export const timeBreakRule = (t: any) => Yup.number()
    .required(t('core.formValidatorMessages.required'))
    .min(60, t('core.formValidatorMessages.min') + 60)
    .max(60 * 24, t('core.formValidatorMessages.max') + 60 * 24)


export const priceRule = (t: any) => Yup.number()
    .required(t('core.formValidatorMessages.required'))
    .min(0, t('core.formValidatorMessages.min') + 60)
    .max(Number.MAX_VALUE, t('core.formValidatorMessages.max') + Number.MAX_VALUE)
