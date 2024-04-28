import "@fontsource/inter";
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    initialColorMode: "light",
    useSystemColorMode: true,
    fonts: {
        body: "Inter, system-ui, sans-serif",
        heading: "Inter, system-ui, sans-serif",
    },
    colors: {
        customYellow: {
            500: '#FFDD00',
        }
    },
    components: {
        Modal: {
            sizes: {
                '5xl': {
                    dialog: {
                        maxW: '80%',
                    }
                }
            }
        },
        DuckieAppHeader: {
            variants: {
                light: {
                    bg: '#FFFFFF',
                    border: '1px solid #D9D9D999',
                },
                dark: {
                    bg: '#282828',
                    border: '1px solid #D9D9D999',
                }
            }
        },
        SideBar: {
            variants: {
                light: {
                    bg: '#FFFFFF',
                    border: '1px solid #D9D9D999',
                    borderTop: '0px',
                },
                dark: {
                    bg: '#282828',
                    border: '1px solid #D9D9D999',
                    borderTop: '0px',
                }
            }
        },
        DuckieAgent: {
            variants: {
                light: {
                    bg: '#FFFDF2',
                },
                dark: {
                    bg: '#282828',
                }
            }
        },
        ContentCard: {
            variants: {
                light: {
                    bg: '#FFFFFF',
                    width: '100%',
                    padding: '4',
                    boxShadow: "1px 1px 6px -2px #FFDD00"
                },
                dark: {
                    bg: '#282828',
                    border: '1px solid #D9D9D999',
                    borderRadius: '10px',
                }
            }
        },
        ChatCard: {
            variants: {
                light: {
                    bg: '#FFFFFF',
                    width: '100%',
                    padding: '4',
                    boxShadow: "1px 1px 6px -2px #FFDD00"
                },
                dark: {
                    bg: '#282828',
                    border: '1px solid #D9D9D999',
                    borderRadius: '10px',
                }
            }
        },
    }
})

export default theme