import { useTranslations } from 'next-intl';
import React from 'react'

const Refferal = () => {
    const t = useTranslations("HomePage");

    return (
        <div>Refferal
            <h1>{t("title")}</h1>
        </div>
    )
}

export default Refferal 