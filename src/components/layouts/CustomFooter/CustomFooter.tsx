
import { Box, Link } from "@mui/material";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useStyles } from './CustomFooter.styles';

export default function CustomFooter() {
    const t = useTranslations();
    const classes = useStyles();
    return (
        <Box sx={{bgcolor: (theme) => theme.palette.background.paper, width:"100%"}}>
        <Box
            sx={classes.general_content}
        >
            <Box>
                <Image width={230} height={70} alt='EncodeBiz' src="/assets/images/encodebiz_logo.jpeg" />
            </Box>
            <Box sx={{ display: "flex", gap: "30px" }}>
                <Box sx={classes.links_content}>
                    <Link
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.encodebiz.com/"
                        underline="hover"
                    >
                        {t("layout.footer.web")}
                    </Link>
                    <Link
                        target="_blank"
                        rel="noreferrer"
                        href="tel:+34623519591"
                        underline="hover"
                    >
                        {t("layout.footer.contactUs")}
                    </Link>
                    <Link
                        target="_blank"
                        rel="noreferrer"
                        href="https://wa.me/+34623519591?text="
                        underline="hover"
                    >
                        {t("layout.footer.whatsApp")}
                    </Link>
                </Box>
                <Box>
                    <Box sx={classes.links_content}>
                        <Link
                            rel="noreferrer"
                            href="/main/policy"
                            underline="hover"
                        >
                            {t("layout.footer.policy")}
                        </Link>
                        <Link
                            rel="noreferrer"
                            href="/main/terms"
                            underline="hover"
                        >
                            {t("layout.footer.terms")}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
        </Box>
    );
}