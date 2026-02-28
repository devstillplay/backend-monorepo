(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/stillPlay-mobile/src/components/MobileFrame.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileFrame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function MobileFrame({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-root",
        suppressHydrationWarning: true,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/stillPlay-mobile/src/components/MobileFrame.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = MobileFrame;
var _c;
__turbopack_context__.k.register(_c, "MobileFrame");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/stillPlay-mobile/src/lib/env.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "endpoints",
    ()=>endpoints,
    "getBaseUrl",
    ()=>getBaseUrl,
    "requireBaseUrl",
    ()=>requireBaseUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const baseUrl = ("TURBOPACK compile-time truthy", 1) ? "http://localhost:3000/api" : "TURBOPACK unreachable";
function getBaseUrl() {
    return baseUrl;
}
function requireBaseUrl() {
    if (!getBaseUrl()) //TURBOPACK unreachable
    ;
}
const endpoints = {
    auth: {
        requestCode: ()=>`${getBaseUrl()}/auth/request-code`,
        verifyCode: ()=>`${getBaseUrl()}/auth/verify-code`,
        login: ()=>`${getBaseUrl()}/auth/login`,
        register: ()=>`${getBaseUrl()}/auth/register`,
        forgotPassword: ()=>`${getBaseUrl()}/auth/forgot-password`,
        resetPassword: ()=>`${getBaseUrl()}/auth/reset-password`
    },
    user: {
        profile: ()=>`${getBaseUrl()}/user`
    },
    loans: {
        wallet: (userId)=>`${getBaseUrl()}/loans/wallet/${userId}`,
        list: (userId)=>`${getBaseUrl()}/loans/list/${userId}`,
        repayments: (userId)=>`${getBaseUrl()}/loans/repayments/${userId}`,
        eligibility: (userId)=>`${getBaseUrl()}/loans/eligibility/${userId}`,
        request: ()=>`${getBaseUrl()}/loans/request`,
        repay: ()=>`${getBaseUrl()}/loans/repay`
    },
    files: {
        upload: ()=>`${getBaseUrl()}/files/upload`
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/stillPlay-mobile/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeToken",
    ()=>decodeToken,
    "getLoanEligibility",
    ()=>getLoanEligibility,
    "getProfile",
    ()=>getProfile,
    "getWallet",
    ()=>getWallet,
    "isTokenExpired",
    ()=>isTokenExpired,
    "listLoans",
    ()=>listLoans,
    "listUserRepayments",
    ()=>listUserRepayments,
    "login",
    ()=>login,
    "recordLoanRepayment",
    ()=>recordLoanRepayment,
    "registerUser",
    ()=>registerUser,
    "requestLoan",
    ()=>requestLoan,
    "requestRegisterCode",
    ()=>requestRegisterCode,
    "uploadImage",
    ()=>uploadImage,
    "verifyCode",
    ()=>verifyCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/lib/env.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/store/useAuthStore.ts [app-client] (ecmascript)");
;
;
/**
 * Decode a JWT payload without verifying the signature.
 * Returns null if the token is malformed.
 */ function decodeJwtPayload(token) {
    try {
        const part = token.split(".")[1];
        if (!part) return null;
        const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch  {
        return null;
    }
}
function isTokenExpired(token) {
    if (!token) return true;
    const payload = decodeJwtPayload(token);
    if (!payload) return true;
    const exp = payload.exp;
    if (typeof exp !== "number") return false; // no expiry claim → treat as valid
    return Date.now() >= exp * 1000;
}
function decodeToken(token) {
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    return {
        userId: payload.userId ?? payload.sub ?? "",
        email: payload.email ?? "",
        role: payload.role ?? "Customer",
        verified: Boolean(payload.verified)
    };
}
function getAuthHeaders(token) {
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}
function handleAuthError(res) {
    if (res.status === 401) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().reset();
    }
}
async function login(payload) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].auth.login(), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : Array.isArray(data.message) ? data.message[0] : "Invalid email or password");
    }
    return data;
}
async function getProfile(token) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].user.profile(), {
        headers: getAuthHeaders(token)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Failed to load profile");
    }
    // Response shape: { message: string, user: UserProfileResponse }
    const profile = data.user ?? data;
    return profile;
}
async function getWallet(token, userId) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].loans.wallet(userId), {
        headers: getAuthHeaders(token)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Failed to load wallet");
    }
    return data;
}
async function listLoans(token, userId) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].loans.list(userId), {
        headers: getAuthHeaders(token)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Failed to load loans");
    }
    // Response shape from loan-service: { loans: LoanItem[] }
    if (Array.isArray(data)) return data;
    const nested = data;
    return nested.loans ?? nested.data ?? [];
}
async function getLoanEligibility(token, userId) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].loans.eligibility(userId), {
        headers: getAuthHeaders(token)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Failed to check eligibility");
    }
    return data;
}
async function requestLoan(token, payload) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].loans.request(), {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : Array.isArray(data.message) ? data.message[0] : "Failed to submit loan request");
    }
    return data;
}
async function registerUser(payload) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].auth.register(), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : Array.isArray(data.message) ? data.message[0] : "Registration failed");
    }
    return data;
}
async function requestRegisterCode(payload) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].auth.requestCode(), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            type: "register",
            ...payload
        })
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : Array.isArray(data.message) ? data.message[0] : "Failed to send verification code");
    }
    return data;
}
async function verifyCode(payload) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].auth.verifyCode(), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : Array.isArray(data.message) ? data.message[0] : "Invalid or expired code");
    }
    return data;
}
async function uploadImage(file, options) {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.folder) formData.append("folder", options.folder);
    const headers = {};
    if (options?.token) {
        headers["Authorization"] = `Bearer ${options.token}`;
    }
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].files.upload(), {
        method: "POST",
        headers,
        body: formData
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : data.error ?? "Upload failed");
    }
    return data;
}
async function recordLoanRepayment(token, payload) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].loans.repay(), {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : Array.isArray(data.message) ? data.message[0] : "Failed to record repayment");
    }
    return data;
}
async function listUserRepayments(token, userId) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpoints"].loans.repayments(userId), {
        headers: getAuthHeaders(token)
    });
    const data = await res.json().catch(()=>({}));
    handleAuthError(res);
    if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Failed to load repayments");
    }
    // Response shape: { userId, repayments: [...] }
    const raw = data;
    return Array.isArray(raw) ? raw : raw.repayments ?? [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/stillPlay-mobile/src/store/useAuthStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/lib/api.ts [app-client] (ecmascript)");
;
;
;
const initialState = {
    status: "unauthenticated",
    token: null,
    user: null,
    otpEmail: null,
    otpExpiresAt: null,
    fullName: null,
    _hasRehydrated: false,
    lastLoginAt: null,
    isAuthenticated: false
};
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        ...initialState,
        setPendingOtp: (email, otpExpiresAt, fullName)=>set({
                status: "otp_required",
                otpEmail: email,
                otpExpiresAt,
                fullName: fullName ?? null
            }),
        setAuthenticated: (token, user)=>set({
                status: "authenticated",
                token,
                user,
                otpEmail: null,
                otpExpiresAt: null,
                lastLoginAt: Date.now(),
                isAuthenticated: true
            }),
        setUser: (user)=>set({
                user
            }),
        setRehydrated: ()=>set({
                _hasRehydrated: true
            }),
        reset: ()=>set({
                ...initialState,
                _hasRehydrated: true,
                isAuthenticated: false
            }),
        login: ()=>set({
                isAuthenticated: true,
                status: "authenticated"
            }),
        logout: ()=>set({
                ...initialState,
                _hasRehydrated: true
            })
    }), {
    name: "stillplay-mobile-auth",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return localStorage;
    }),
    partialize: (state)=>({
            status: state.status,
            token: state.token,
            user: state.user,
            fullName: state.fullName,
            otpEmail: state.otpEmail,
            otpExpiresAt: state.otpExpiresAt,
            lastLoginAt: state.lastLoginAt,
            isAuthenticated: state.isAuthenticated
        }),
    onRehydrateStorage: ()=>()=>{
            const state = useAuthStore.getState();
            // If the persisted token is expired, clear auth before marking as rehydrated
            // so the dashboard guard always redirects to login with a clean state.
            if (state.status === "authenticated" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTokenExpired"])(state.token)) {
                state.reset();
            } else {
                state.setRehydrated();
            }
        }
}));
const __TURBOPACK__default__export__ = useAuthStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/stillPlay-mobile/src/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/Alert/Alert.js [app-client] (ecmascript) <export default as Alert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/CircularProgress/CircularProgress.js [app-client] (ecmascript) <export default as CircularProgress>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/IconButton/IconButton.js [app-client] (ecmascript) <export default as IconButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/InputAdornment/InputAdornment.js [app-client] (ecmascript) <export default as InputAdornment>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/Stack/Stack.js [app-client] (ecmascript) <export default as Stack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/TextField/TextField.js [app-client] (ecmascript) <export default as TextField>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Visibility$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/icons-material/esm/Visibility.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/icons-material/esm/VisibilityOff.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$components$2f$MobileFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/components/MobileFrame.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/store/useAuthStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function LoginPageContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "LoginPageContent.useAuthStore[status]": (s)=>s.status
    }["LoginPageContent.useAuthStore[status]"]);
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "LoginPageContent.useAuthStore[token]": (s)=>s.token
    }["LoginPageContent.useAuthStore[token]"]);
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "LoginPageContent.useAuthStore[user]": (s)=>s.user
    }["LoginPageContent.useAuthStore[user]"]);
    const setAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "LoginPageContent.useAuthStore[setAuthenticated]": (s)=>s.setAuthenticated
    }["LoginPageContent.useAuthStore[setAuthenticated]"]);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // isMounted starts false on both server and client's first render, preventing
    // a React hydration mismatch. The auth check only runs after mount, at which
    // point Zustand has already fully synced from localStorage (sync storage).
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginPageContent.useEffect": ()=>{
            setIsMounted(true);
        }
    }["LoginPageContent.useEffect"], []);
    // If a valid session is already in the store, skip the login page entirely.
    const isValidSession = status === "authenticated" && !!token && !!user?.id && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTokenExpired"])(token);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginPageContent.useEffect": ()=>{
            if (!isMounted) return;
            if (isValidSession) {
                // Verified users go to dashboard; unverified users wait for admin approval
                if (user?.verified === false) {
                    router.replace("/pending-verification");
                } else {
                    router.replace("/dashboard");
                }
            }
        }
    }["LoginPageContent.useEffect"], [
        isMounted,
        isValidSession,
        user?.verified,
        router
    ]);
    // All hooks must be declared before any conditional returns.
    const mutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "LoginPageContent.useMutation[mutation]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])({
                    email: email.trim(),
                    password
                })
        }["LoginPageContent.useMutation[mutation]"],
        onSuccess: {
            "LoginPageContent.useMutation[mutation]": (data)=>{
                const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeToken"])(data.token);
                const userProfile = decoded ? {
                    id: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                    verified: decoded.verified
                } : null;
                setAuthenticated(data.token, userProfile);
                // Unverified users must wait for admin approval before accessing the dashboard
                if (userProfile?.verified === false) {
                    router.replace("/pending-verification");
                } else {
                    router.replace("/dashboard");
                }
            }
        }["LoginPageContent.useMutation[mutation]"]
    });
    const handleSubmit = (e)=>{
        e.preventDefault();
        mutation.mutate();
    };
    // While checking auth (before mount) or mid-redirect, show a neutral spinner
    // so the user never sees a flash of the login form before being taken in.
    if (!isMounted || isValidSession) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$components$2f$MobileFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                className: "screen-content",
                sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__["CircularProgress"], {
                    color: "primary"
                }, void 0, false, {
                    fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                    lineNumber: 98,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$components$2f$MobileFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
            className: "screen-content",
            sx: {
                p: 3
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                spacing: 3,
                sx: {
                    height: "100%"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                        spacing: 1,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                variant: "h4",
                                fontWeight: 700,
                                children: "Welcome back"
                            }, void 0, false, {
                                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                color: "text.secondary",
                                children: "Your football space is waiting for you."
                            }, void 0, false, {
                                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        component: "form",
                        onSubmit: handleSubmit,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                            spacing: 2,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                                    spacing: 1,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            fontWeight: 600,
                                            children: "Email address"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                            lineNumber: 120,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                            placeholder: "you@example.com",
                                            value: email,
                                            onChange: (e)=>setEmail(e.target.value),
                                            type: "email",
                                            required: true,
                                            fullWidth: true,
                                            sx: {
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#f2f2f2",
                                                    borderRadius: 999,
                                                    "& fieldset": {
                                                        border: "none"
                                                    },
                                                    "&:hover fieldset": {
                                                        border: "none"
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        border: "none"
                                                    }
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                                    spacing: 1,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            fontWeight: 600,
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                            placeholder: "••••••••",
                                            value: password,
                                            onChange: (e)=>setPassword(e.target.value),
                                            type: showPassword ? "text" : "password",
                                            required: true,
                                            fullWidth: true,
                                            slotProps: {
                                                input: {
                                                    endAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__["InputAdornment"], {
                                                        position: "end",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                                            "aria-label": showPassword ? "Hide password" : "Show password",
                                                            onClick: ()=>setShowPassword((p)=>!p),
                                                            edge: "end",
                                                            size: "small",
                                                            children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VisibilityOff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 45
                                                            }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Visibility$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 69
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 27
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 25
                                                    }, void 0)
                                                }
                                            },
                                            sx: {
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#f2f2f2",
                                                    borderRadius: 999,
                                                    "& fieldset": {
                                                        border: "none"
                                                    },
                                                    "&:hover fieldset": {
                                                        border: "none"
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        border: "none"
                                                    }
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                            lineNumber: 146,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    component: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                                    href: "/forgot-password",
                                    sx: {
                                        alignSelf: "flex-end",
                                        color: "primary.main",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        fontSize: "0.875rem"
                                    },
                                    children: "Forgot password?"
                                }, void 0, false, {
                                    fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                    lineNumber: 181,
                                    columnNumber: 15
                                }, this),
                                mutation.isError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__["Alert"], {
                                    severity: "error",
                                    children: mutation.error.message
                                }, void 0, false, {
                                    fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        flex: 1
                    }, void 0, false, {
                        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                        spacing: 2,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                variant: "contained",
                                size: "large",
                                fullWidth: true,
                                disabled: mutation.isPending,
                                onClick: ()=>mutation.mutate(),
                                children: mutation.isPending ? "Logging in..." : "Log in to Still Play"
                            }, void 0, false, {
                                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                variant: "body2",
                                textAlign: "center",
                                color: "text.secondary",
                                children: [
                                    "Don't have an account?",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        component: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                                        href: "/signup",
                                        variant: "body2",
                                        sx: {
                                            color: "primary.main",
                                            fontWeight: 600,
                                            textDecoration: "none"
                                        },
                                        children: "Sign up"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
            lineNumber: 106,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(LoginPageContent, "EwaZxhAsj9TuF7Pbit9OD7ysha0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = LoginPageContent;
function LoginPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$components$2f$MobileFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                className: "screen-content",
                sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                    color: "text.secondary",
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                    lineNumber: 243,
                    columnNumber: 13
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
                lineNumber: 239,
                columnNumber: 11
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
            lineNumber: 238,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginPageContent, {}, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
            lineNumber: 248,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/stillPlay-mobile/src/app/login/page.tsx",
        lineNumber: 236,
        columnNumber: 5
    }, this);
}
_c1 = LoginPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "LoginPageContent");
__turbopack_context__.k.register(_c1, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_stillPlay-mobile_src_439d63b3._.js.map