<%
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
%>

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
    <link href="styles/scrabble.min.css" type="text/css" rel="stylesheet" />
    <link href="styles/scrabble.mobile.min.css" type="text/css" rel="stylesheet" />
    <link id="LangStyle" runat="server" href="styles/css/te.min.css" type="text/css" rel="stylesheet" />
</head>
<body>
    <div class="brand">
        <h2 class="h2" runat="server" id="H2">పదకేళి</h2>
    </div>
    <div class="loading" id="root">
        <h3>Loading...
            <img width="64" height="80" alt="Loading..." src="images/loading.svg" /></h3>
    </div>
    <div class="footer">
        <br />
        <br />
        <br />
        <br />
        <br />
        <span id="Author2" runat="server" class="author">~ Dileep Miriyala(దిలీపు మిరియాల)</span>
    </div>
    <script type="text/javascript" src="Config.ashx?<%= Query %>"> </script>
    <script data-main="scripts/Game" src="scripts/require.js"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-118249672-1"></script>
    <script>window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', 'UA-118249672-1');</script>
</body>
</html>
