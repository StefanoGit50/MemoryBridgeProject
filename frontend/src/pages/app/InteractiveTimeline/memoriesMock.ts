import type { MemoryItem } from '@/shared/Post/types';

// Inserisci qui il nome o percorso della tua immagine caricata
import fotoFamiglia from '@/images/0014314705.jpg';

export const TIMELINE_MEMORIES: MemoryItem[] = [
    {
        id: 'm1',
        year: 1965,
        catalogCode: 'EXHIBIT 1965-01 / ARCHIVIO HAN',
        dateStr: 'Estate 1965',
        authorName: 'Elena Han',
        authorAvatar:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        title: 'La Grande Riunione di Famiglia',
        story:
            "Tutti i rami della famiglia riuniti nel cortile di casa. Al centro il nonno con il suo gilet coordinato e gli zii in abito elegante. In primo piano i più piccoli, con i loro abiti della festa in maglia bianca. Un istante scolpito nel tempo che custodisce le nostre radici e il calore indimenticabile di quel pomeriggio d'estate.",
        imageUrl: fotoFamiglia,
        likesCount: 24,
        comments: [
            {
                id: 'c1',
                author: 'Zia Caterina',
                avatar:
                    'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80',
                date: '2 ore fa',
                text: 'Che meraviglia rivedere questa foto! Ricordo ancora il profumo delle zeppole che la nonna aveva preparato per tutti.',
                likesCount: 0
            },
            {
                id: 'c2',
                author: 'Marco Han',
                avatar:
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                date: '1 ora fa',
                text: 'Il bambino a sinistra in prima fila ero io! Avevo un capriccio terribile perché volevo andare a giocare col pallone.',
                likesCount: 0
            },
        ],
    },
    {
        id: 'm2',
        year: 1978,
        catalogCode: 'EXHIBIT 1978-04 / ARCHIVIO ROSSI',
        dateStr: '2 Settembre 1978',
        authorName: 'Roberto Rossi',
        authorAvatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        title: 'Viaggio verso il Mare in Fiat 127',
        story:
            'Il primo viaggio lungo verso la Calabria con la macchina nuova blu. Valigie sul tettuccio, finestrini abbassati e la musica della radio a farci compagnia durante tutto il tragitto. Una tappa fondamentale nei ricordi della nostra giovinezza.',
        imageUrl:
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        likesCount: 18,
        comments: [
            {
                id: 'c3',
                author: 'Luisa Rossi',
                avatar:
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                date: 'Ieri',
                text: 'Si è fuso il radiatore a metà strada, te lo ricordi? Ma è stato il viaggio più bello di sempre.',
                likesCount:0
            },
        ],
    },
    {
        id: 'm3',
        year: 1984,
        catalogCode: 'EXHIBIT 1984-09 / ARCHIVIO BIANCHI',
        dateStr: '15 Agosto 1984',
        authorName: 'Anna Bianchi',
        authorAvatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        title: 'Pranzo di Ferragosto in Compagnia',
        story:
            "Tavolate lunghissime all'ombra del pergolato. Risate, bicchieri di vino che si alzano in brindisi continui e piatti colmi di prelibatezze preparate fin dalle prime ore dell'alba.",
        imageUrl:
            'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
        likesCount: 31,
        comments: [],
    },
    {
        id: 'm4',
        year: 1992,
        catalogCode: 'EXHIBIT 1992-12 / ARCHIVIO VERDI',
        dateStr: 'Natale 1992',
        authorName: 'Giorgio Verdi',
        authorAvatar:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
        title: 'La Nevicata Memorabile',
        story:
            'La città e la casa di campagna completamente sommerse da un metro di neve fresca. Usciti fuori con stivali e sciarpe per costruire un gigantesco pupazzo di neve.',
        imageUrl:
            'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1600&q=80',
        likesCount: 42,
        comments: [],
    },
    {
        id: 'm5',
        year: 1995,
        catalogCode: 'EXHIBIT 1995-03 / ARCHIVIO NERI',
        dateStr: '10 Luglio 1995',
        authorName: 'Martina Neri',
        authorAvatar:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        title: 'Gita in Montagna',
        story:
            'Passeggiata sui sentieri alpini con zaino in spalla e bastoni da trekking. Aria frizzante e panorama mozzafiato dalla cima.',
        imageUrl:
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
        likesCount: 15,
        comments: [],
    },
    {
        id: 'm6',
        year: 2001,
        catalogCode: 'EXHIBIT 2001-08 / ARCHIVIO CONTI',
        dateStr: 'Capodanno 2001',
        authorName: 'Davide Conti',
        authorAvatar:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
        title: 'Festa di Inizio Millennio',
        story:
            "Festeggiamenti in piazza con musica, canti e fuochi d'artificio per dare il benvenuto al nuovo millennio insieme agli amici di una vita.",
        imageUrl:
            'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1600&q=80',
        likesCount: 50,
        comments: [],
    },
];