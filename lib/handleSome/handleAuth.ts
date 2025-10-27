import puppeteer from "puppeteer";
import axios from "axios";

const YOUTUBE_API_BASE_URL =
  "https://accounts.google.com/AddSession?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Did%26next%3D%252F&hl=id&passive=false&service=youtube&uilel=0";

export const handleAuthLogin = async (excludeData: any) => {
  const { login, password } = excludeData;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-notifications",
      "--disable-infobars",
      "--disable-popup-blocking",
    ],
    defaultViewport: null,
  });
  const newPage = await browser.newPage();
  try {
    const selectorLogin = {
      inputLogin: 'input[type="email"]',
      inputPassword: 'input[type="password"]',
      buttonNext: "#identifierNext, #passwordNext",
    };
    await newPage.goto(YOUTUBE_API_BASE_URL, { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 4000));
    await newPage.waitForSelector(selectorLogin.inputLogin, { visible: true });
    await newPage.type(selectorLogin.inputLogin, login, { delay: 100 });
    await newPage.click(selectorLogin.buttonNext);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await newPage.waitForSelector(selectorLogin.inputPassword, {
      visible: true,
    });
    await newPage.type(selectorLogin.inputPassword, password, { delay: 100 });
    await newPage.click(selectorLogin.buttonNext);
    await newPage.waitForNavigation({ waitUntil: "networkidle2" });
    const cookies = await newPage.cookies();

    console.log("ini adalah cookies", cookies);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await browser.close();
    return cookies;
  } catch (error) {
    console.error("Error in handleAuth:", error);
    throw error;
  }
};

export const handleAuthSinkronize = async (cookies: any) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--disable-notifications",
        "--disable-infobars",
        "--disable-popup-blocking",
      ],
      defaultViewport: null,
    });

    const newPage = await browser.newPage();
    const newCookies = await newPage.setCookie(...cookies);
    await newPage.goto(YOUTUBE_API_BASE_URL, {
      waitUntil: "networkidle2",
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await browser.close();
    return { success: true,data: newCookies, message: "Authentication synchronized successfully." };
  } catch (error) {
    console.error("Error in handleAuthSinkronize:", error);
    throw error;
  }
};
