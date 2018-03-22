﻿<!--
//---------------------------------------------------------------------------------------------
// <copyright file="scrabble.aspx" company="Chandam-ఛందం">
    //    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
    //    Original Author : Dileep Miriyala (m.dileep@gmail.com)
    //    Last Updated    : 25-Feb-2018 14:26EST
    //    Revisions:
    //       Version    | Author                   | Email                     | Remarks
    //       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
    //       _._        | <TODO>                   |   <TODO>                  | <TODO>
        // </copyright>
//---------------------------------------------------------------------------------------------
-->

<%@ Page Language="C#" AutoEventWireup="true" Inherits="Scrabble.Server.Home" EnableViewState="false" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="<%= Lang %>">
<head runat="server" id="Head">
    <title>పదకేళి ~ Scrabble for Telugu</title>
    <meta id="Keywords" runat="server" name="keywords" content="Telugu Scrabble" />
    <meta id="Description" runat="server" name="description" content="Telugu Scrabble" />
    <meta id="Author" runat="server" name="author" content="Dileep Miriyala(దిలీపు మిరియాల)" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" href="Miriyam.ico" />
    <link href="styles/scrabble.css" type="text/css" rel="stylesheet" />
    <link id="LangStyle" runat="server" href="styles/te.css" type="text/css" rel="stylesheet" />
</head>
<body>
    <div class="title">
        <h2 class="h2" runat="server" id="H2">పదకేళి</h2>
    </div>
    <div class="" id="root"></div>
    <div class="footer"><span id="Author2" runat="server" class="author">~ Dileep Miriyala(దిలీపు మిరియాల)</span></div>
    <div id="Scripts" runat="server"></div>
    <script data-main="scripts/Index" src="scripts/require.js"></script>
</body>
</html>