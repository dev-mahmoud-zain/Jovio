import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { BrowserEnum, DeviceTypeEnum, I_DeviceInfo, OSEnum } from "src/Common/Interfaces/jwt.interface";

import { UAParser } from "ua-parser-js";


export interface I_Session {
    deviceInfo: I_DeviceInfo,
    ipAddress: string,
    userAgent: string
}

@Injectable()
export class ClientInfoService {



    private parseDeviceInfo(userAgent: string) {
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        // Device Type
        let type = DeviceTypeEnum.DESKTOP;
        if (result.device.type === "mobile") type = DeviceTypeEnum.MOBILE;
        if (result.device.type === "tablet") type = DeviceTypeEnum.TABLET;

        // OS
        let os: OSEnum;
        switch (result.os.name) {
            case "Windows":
                os = OSEnum.WINDOWS;
                break;
            case "Mac OS":
                os = OSEnum.MAC_OS;
                break;
            case "Android":
                os = OSEnum.ANDROID;
                break;
            case "iOS":
                os = OSEnum.IOS;
                break;
            default:
                os = OSEnum.LINUX;
        }

        // Browser
        let browser: BrowserEnum;
        switch (result.browser.name) {
            case "Firefox":
                browser = BrowserEnum.FIREFOX;
                break;
            case "Safari":
                browser = BrowserEnum.SAFARI;
                break;
            case "Edge":
                browser = BrowserEnum.EDGE;
                break;
            default:
                browser = BrowserEnum.CHROME; // Chromium-based
        }

        return {
            type,
            os,
            browser
        };
    }

    getUserSessionContext(req: Request): I_Session {


        const userAgent = req.headers["user-agent"] || "";

        const ipAddress =
            (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            req.socket.remoteAddress ||
            "";

        const deviceInfo = this.parseDeviceInfo(userAgent);



        return {
            deviceInfo,
            ipAddress,
            userAgent
        };
    }

}
