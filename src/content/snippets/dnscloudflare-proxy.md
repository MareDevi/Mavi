---
title: 解决启用DNS启用Cloudflare Proxy后无法访问的问题
date: 2025-12-15
description: 解决Caddy反向代理与Cloudflare Proxy冲突问题
tags:
  - cloudflare
  - dns
image: ""
imageAlt: ""
imageOG: false
hideCoverImage: true
hideTOC: false
targetKeyword: ""
draft: false
language: else
---
## 问题现象

在使用 Caddy 作为反向代理服务器，并在其前方套用 Cloudflare CDN 时，访问网站出现 `ERR_TOO_MANY_REDIRECTS` 错误，或者浏览器提示“网页无法正常运作，将您重定向的次数过多”。

## 原因分析

这是经典的 SSL/TLS 加密模式错配问题：

1. **Cloudflare 端**：默认的 SSL 设置可能是 **"Flexible"**。在这种模式下，Cloudflare 会通过 **HTTP (80端口)** 连接源服务器（Caddy），但对访客展示 HTTPS。
    
2. **Caddy 端**：Caddy 默认强制开启 HTTPS。当它收到来自 Cloudflare 的 HTTP 请求时，会返回一个 `301 Redirect` 响应，要求升级到 HTTPS。
    
3. **死循环**：Cloudflare 收到 301 后，再次尝试请求（依然通过 HTTP，因为它是 Flexible 模式），Caddy 再次重定向，形成死循环 。
    

## 解决方案

将 Cloudflare 的 SSL/TLS 模式从 **Flexible** 改为 **Full** 或 **Full (Strict)**。

- **Full**: 允许 Caddy 使用自签名证书（Caddy 默认会自动生成自签名证书用于内部加密）。
    
- **Full (Strict)**: 要求 Caddy 必须有有效的受信任证书（Caddy 自动申请的 Let's Encrypt 证书通常满足此要求）。