const getIdFromFacebookUrl = () => {
    const url = window.location.toString()
    const match = url.match(/(?<=marketplace\/item\/)\d+/g)
    return match ? match[0] : null
}

const facebookFireKeywords = () => ['div[data-pagelet=root]']

const facebookScraping = () => {
    const prices = [document.querySelector('div[data-pagelet=root] > div.rq0escxv.l9j0dhe7.du4w35lb > div:nth-child(7) > div > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div.j83agx80.cbu4d94t.h3gjbzrl.l9j0dhe7.du4w35lb.qsy8amke > div.nznu9b0o.ji94ytn4.q10oee1b.r893ighp.ni8dbmo4.stjgntxs.k4urcfbm.spskuzq3.a156tdzh > div > div.cwj9ozl2.j83agx80.cbu4d94t.datstx6m.owwhemhu.ni8dbmo4.stjgntxs.spskuzq3 > div > div.am9z0op8.j83agx80.l31c4sg5.datstx6m.l9j0dhe7.k4urcfbm.jr1d8bo4.dwxd3oue > div.j83agx80.cbu4d94t.pfnyh3mw.k4urcfbm.jr1d8bo4.dwxd3oue.o387gat7 > div.q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.d8ncny3e.buofh1pr.g5gj957u.tgvbjcpo.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.k4xni2cv.do00u71z.ofv0k9yr.k4urcfbm.spskuzq3 > div.j83agx80.cbu4d94t.buofh1pr.l9j0dhe7 > div.dati1w0a.qt6c0cv9.hv4rvrfc.discj3wi > div.aov4n071.j83agx80 > div.ku2m03ct > span')
        || document.querySelector('div[data-pagelet=root] > div.rq0escxv.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.buofh1pr.dp1hu0rb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb > div > div > div > div > div > div.cwj9ozl2.j83agx80.cbu4d94t.m6nq13hx.owwhemhu.ni8dbmo4.stjgntxs.spskuzq3 > div > div.am9z0op8.j83agx80.o387gat7.datstx6m.l9j0dhe7.k4urcfbm.jr1d8bo4.dwxd3oue > div > div.q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.d8ncny3e.buofh1pr.g5gj957u.tgvbjcpo.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.k4xni2cv.do00u71z.ofv0k9yr.k4urcfbm.spskuzq3 > div.j83agx80.cbu4d94t.buofh1pr.l9j0dhe7 > div.dati1w0a.qt6c0cv9.hv4rvrfc.discj3wi > div.aov4n071.j83agx80 > div.ku2m03ct > span')]
    const titles = [document.querySelector('div[data-pagelet=root] > div.rq0escxv.l9j0dhe7.du4w35lb > div:nth-child(7) > div > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div.j83agx80.cbu4d94t.h3gjbzrl.l9j0dhe7.du4w35lb.qsy8amke > div.nznu9b0o.ji94ytn4.q10oee1b.r893ighp.ni8dbmo4.stjgntxs.k4urcfbm.spskuzq3.a156tdzh > div > div.cwj9ozl2.j83agx80.cbu4d94t.datstx6m.owwhemhu.ni8dbmo4.stjgntxs.spskuzq3 > div > div.am9z0op8.j83agx80.l31c4sg5.datstx6m.l9j0dhe7.k4urcfbm.jr1d8bo4.dwxd3oue > div.j83agx80.cbu4d94t.pfnyh3mw.k4urcfbm.jr1d8bo4.dwxd3oue.o387gat7 > div.q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.d8ncny3e.buofh1pr.g5gj957u.tgvbjcpo.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.k4xni2cv.do00u71z.ofv0k9yr.k4urcfbm.spskuzq3 > div.j83agx80.cbu4d94t.buofh1pr.l9j0dhe7 > div.dati1w0a.qt6c0cv9.hv4rvrfc.discj3wi > span')
        || document.querySelector('div[data-pagelet=root] > div.rq0escxv.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.buofh1pr.dp1hu0rb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb > div > div > div > div > div > div.cwj9ozl2.j83agx80.cbu4d94t.m6nq13hx.owwhemhu.ni8dbmo4.stjgntxs.spskuzq3 > div > div.am9z0op8.j83agx80.o387gat7.datstx6m.l9j0dhe7.k4urcfbm.jr1d8bo4.dwxd3oue > div > div.q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.d8ncny3e.buofh1pr.g5gj957u.tgvbjcpo.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.k4xni2cv.do00u71z.ofv0k9yr.k4urcfbm.spskuzq3 > div.j83agx80.cbu4d94t.buofh1pr.l9j0dhe7 > div.dati1w0a.qt6c0cv9.hv4rvrfc.discj3wi > span')]

    return [titles, prices]
}

const getDataFromFacebookDOM = () => {
    const body = document.querySelector('html div[data-pagelet=root]')

    if (!body) return null
    return {
        data: JSON.stringify(body.outerHTML),
    }
}
