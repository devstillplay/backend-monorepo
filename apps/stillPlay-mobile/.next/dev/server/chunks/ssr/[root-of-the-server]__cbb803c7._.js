module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/apps/stillPlay-mobile/src/components/MobileFrame.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileFrame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function MobileFrame({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-root",
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/stillPlay-mobile/src/components/MobileFrame.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[project]/apps/stillPlay-mobile/src/lib/env.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "endpoints",
    ()=>endpoints,
    "getBaseUrl",
    ()=>getBaseUrl,
    "requireBaseUrl",
    ()=>requireBaseUrl
]);
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
}),
"[project]/apps/stillPlay-mobile/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/lib/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/store/useAuthStore.ts [app-ssr] (ecmascript)");
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
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().reset();
    }
}
async function login(payload) {
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].auth.login(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].user.profile(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].loans.wallet(userId), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].loans.list(userId), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].loans.eligibility(userId), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].loans.request(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].auth.register(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].auth.requestCode(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].auth.verifyCode(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].files.upload(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].loans.repay(), {
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
    const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endpoints"].loans.repayments(userId), {
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
}),
"[project]/apps/stillPlay-mobile/src/store/useAuthStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/lib/api.ts [app-ssr] (ecmascript)");
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
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
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
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            const noopStorage = {
                getItem: ()=>null,
                setItem: ()=>{},
                removeItem: ()=>{}
            };
            return noopStorage;
        }
        //TURBOPACK unreachable
        ;
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
            if (state.status === "authenticated" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTokenExpired"])(state.token)) {
                state.reset();
            } else {
                state.setRehydrated();
            }
        }
}));
const __TURBOPACK__default__export__ = useAuthStore;
}),
"[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$BottomNavigation$2f$BottomNavigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BottomNavigation$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/BottomNavigation/BottomNavigation.js [app-ssr] (ecmascript) <export default as BottomNavigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$BottomNavigationAction$2f$BottomNavigationAction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BottomNavigationAction$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/BottomNavigationAction/BottomNavigationAction.js [app-ssr] (ecmascript) <export default as BottomNavigationAction>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/Box/Box.js [app-ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/Paper/Paper.js [app-ssr] (ecmascript) <export default as Paper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Home$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/icons-material/esm/Home.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$SportsSoccer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/icons-material/esm/SportsSoccer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/icons-material/esm/Send.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Person$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/icons-material/esm/Person.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/node_modules/@mui/material/esm/CircularProgress/CircularProgress.js [app-ssr] (ecmascript) <export default as CircularProgress>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$components$2f$MobileFrame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/components/MobileFrame.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/store/useAuthStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/stillPlay-mobile/src/lib/api.ts [app-ssr] (ecmascript)");
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
;
;
const navigationItems = [
    {
        label: "Home",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Home$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
            lineNumber: 22,
            columnNumber: 26
        }, ("TURBOPACK compile-time value", void 0)),
        href: "/dashboard"
    },
    {
        label: "Explore",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$SportsSoccer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
            lineNumber: 23,
            columnNumber: 29
        }, ("TURBOPACK compile-time value", void 0)),
        href: "/dashboard/explore"
    },
    {
        label: "Repayment",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
            lineNumber: 24,
            columnNumber: 31
        }, ("TURBOPACK compile-time value", void 0)),
        href: "/dashboard/repayment"
    },
    {
        label: "Profile",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Person$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
            lineNumber: 25,
            columnNumber: 29
        }, ("TURBOPACK compile-time value", void 0)),
        href: "/dashboard/profile"
    }
];
function DashboardLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])((s)=>s.status);
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])((s)=>s.token);
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])((s)=>s.user);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])((s)=>s.reset);
    // Use a local mounted flag instead of Zustand's _hasRehydrated.
    // This ensures server and client both render `false` on the first pass
    // (no React hydration mismatch). By the time the useEffect fires,
    // Zustand has already synced from localStorage (sync storage), so
    // auth state is ready to evaluate.
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    const tokenExpired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTokenExpired"])(token);
    const isInvalid = status !== "authenticated" || !token || !user?.id || tokenExpired;
    // Registered but not yet verified by an admin
    const isPendingVerification = !isInvalid && user?.verified === false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isMounted) return;
        if (isInvalid) {
            reset();
            router.replace("/login");
        } else if (isPendingVerification) {
            router.replace("/pending-verification");
        }
    }, [
        isMounted,
        isInvalid,
        isPendingVerification,
        reset,
        router
    ]);
    if (!isMounted || isInvalid || isPendingVerification) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$components$2f$MobileFrame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                className: "screen-content",
                sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__["CircularProgress"], {
                    color: "primary"
                }, void 0, false, {
                    fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$src$2f$components$2f$MobileFrame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
            className: "screen-content",
            sx: {
                overflow: "hidden"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        flex: 1,
                        height: "100%",
                        position: "relative",
                        overflow: "hidden"
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                    elevation: 8,
                    sx: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        position: "relative",
                        zIndex: 2
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$BottomNavigation$2f$BottomNavigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BottomNavigation$3e$__["BottomNavigation"], {
                        showLabels: false,
                        value: pathname ?? "/dashboard",
                        onChange: (_, newValue)=>{
                            if (typeof newValue === "string" && newValue !== pathname) {
                                router.push(newValue);
                            }
                        },
                        sx: {
                            height: 72,
                            "& .MuiBottomNavigationAction-root": {
                                minWidth: 0,
                                paddingY: 1.5
                            },
                            "& .MuiSvgIcon-root": {
                                fontSize: 30
                            }
                        },
                        children: navigationItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$stillPlay$2d$mobile$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$BottomNavigationAction$2f$BottomNavigationAction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BottomNavigationAction$3e$__["BottomNavigationAction"], {
                                value: item.href,
                                icon: item.icon,
                                label: item.label
                            }, item.href, false, {
                                fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
                                lineNumber: 119,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/stillPlay-mobile/src/app/dashboard/layout.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cbb803c7._.js.map