import path from "./path"
import icons from "./icons"

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`
    },
    {
        id: 3,
        value: 'BLOGS',
        path: `/${path.BLOGS}`
    },
    {
        id: 4,
        value: 'OUR SERVICES',
        path: `/${path.OUR_SERVICES}`
    },
    {
        id: 5,
        value: 'FAQs',
        path: `/${path.FAQ}`
    },
]

const { IoShieldHalf, FaTruckMonster, PiGiftFill, FaReply, FaTty } = icons
export const productExtraInformation = [
    {
        id: '1',
        title: 'Guarantee',
        sub: 'Quality Checked',
        icon: <IoShieldHalf />
    },
    {
        id: '2',
        title: 'Free Shipping',
        sub: 'Free On All Products',
        icon: <FaTruckMonster />
    },
    {
        id: '3',
        title: 'Special Gift Cards',
        sub: 'Special Gift Cards',
        icon: <PiGiftFill />
    },
    {
        id: '4',
        title: 'Free Return',
        sub: 'Within 7 Days',
        icon: <FaReply />
    },
    {
        id: '5',
        title: 'Consultancy',
        sub: 'Lifetime 24/7/356',
        icon: <FaTty />
    },
]

export const productInfoTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        // content: productData?.informations?.DESCRIPTION,
    },
    {
        id: 2,
        name: 'WARRANTY',
        // content: productData?.informations?.WARRANTY,
    },
    {
        id: 3,
        name: 'DELIVERY',
        // content: productData?.informations?.DELIVERY,
    },
    {
        id: 4,
        name: 'PAYMENT',
        // content: productData?.informations?.PAYMENT,
    },
]

export const colors = [
    'black',
    'brown',
    'gray',
    'white',
    'pink',
    'orange',
    'purole',
    'red',
    'blue',
    'green',
    'yellow',
]

export const sorts = [
    {
        id: 1,
        value: '-sold',
        text: 'Best selling',
    },
    {
        id: 2,
        value: 'title',
        text: 'Alphabetically, A-Z',
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabetically, Z-A',
    },
    {
        id: 4,
        value: '-price',
        text: 'Price, high to low',
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, low to high',
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Date, new to old',
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Date, old to new',
    },
]

export const voteOption = [
    {
        id: 1,
        text: 'Terrible',
    },
    {
        id: 2,
        text: 'Bad',
    },
    {
        id: 3,
        text: 'Neutral',
    },
    {
        id: 4,
        text: 'Good',
    },
    {
        id: 5,
        text: 'Perfect',
    },
]

const { RiDashboard2Line, HiOutlineUserGroup, RiProductHuntLine, RiBillLine ,MdSmartphone,
    FaTabletAlt,
    MdLaptopChromebook,
    MdOutlineSpeaker,
    PiTelevisionSimpleFill,
    LuPrinterCheck,
    FaCamera,
    FiSettings, } = icons
export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DAHBOARD}`,
        icon: <RiDashboard2Line size={20}/>
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage Users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <HiOutlineUserGroup size={20}/>
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Manage Products',
        icon: <RiProductHuntLine size={20}/>,
        submenu: [
            {
                text: 'Create Product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
            },
            {
                text: 'Manage Product',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
            },
        ]
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage Order',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <RiBillLine size={20}/>
    },
]

export const memberSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Persional',
        path: `/${path.MEMBER}/${path.PERSIONAL}`,
        icon: <RiDashboard2Line size={20}/>
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'My Cart',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <HiOutlineUserGroup size={20}/>
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Buy History',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <RiBillLine size={20}/>
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Wish List',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <RiBillLine size={20}/>
    },
]

export const roles = [
    {
        code: 1102,
        value: 'Admin',
    },
    {
        code: 2002,
        value: 'User',
    },
]

export const blockstatus = [
    {
        code: true,
        value: 'Blocked',
    },
    {
        code: false,
        value: 'Active',
    },
]

export const statusOrders = [
    {
        label: 'Canceled',
        value: 'Canceled',
    },
    {
        label: 'Succeed',
        value: 'Succeed',
    },
]
export const categoriess = [
    {
        id: '1',
        title: 'SmartPhone',
        path:`${1}`,
        icon: <MdSmartphone />
    },
    {
        id: '2',
        title: 'Tablet',
        path:`${1}`,
        icon: <FaTabletAlt />
    },
    {
        id: '3',
        title: 'Laptop',
        path:`${1}`,
        icon: <MdLaptopChromebook />
    },
    {
        id: '4',
        title: 'Speaker',
        path:`${1}`,
        icon: <MdOutlineSpeaker />
    },
    {
        id: '5',
        title: 'Television',
        path:`${1}`,
        icon: <PiTelevisionSimpleFill />
    },
    {
        id: '6',
        title: 'Printer',
        path:`${1}`,
        icon: <LuPrinterCheck />
    },
    {
        id: '7',
        title: 'Camera',
        path:`${1}`,
        icon: <FaCamera />
    },
    {
        id: '8',
        title: 'Accessories',
        path:`${1}`,
        icon: <FiSettings />
    },
]