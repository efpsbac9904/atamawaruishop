import { Character } from '../types/characters';

export const characterData: Character[] = [
  {
    id: 'speedy-sophie',
    name: '智子',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialty: '素早い問題解決',
    learningStyle: '直感的な高速学習',
    description: '智子は驚異的なスピードで問題を解きますが、時々急ぐあまり細部を見落とすことも。タイムアタックや瞬発力が必要な場面で真価を発揮します。',
    stats: {
      speed: 9,
      accuracy: 6,
      consistency: 7
    },
    color: '#3B82F6' // blue
  },
  {
    id: 'methodical-max',
    name: '正人',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialty: '分析的思考',
    learningStyle: '体系的なアプローチ',
    description: '正人は各問題を慎重に分析し、複雑な概念を分解して理解します。その方法論的な性質は高い正確性を保証しますが、時間がかかることも。',
    stats: {
      speed: 6,
      accuracy: 9,
      consistency: 8
    },
    color: '#8B5CF6' // purple
  },
  {
    id: 'consistent-clara',
    name: '明子',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialty: '着実な進歩',
    learningStyle: '規則正しい学習習慣',
    description: '明子は難易度に関係なく一定のペースを保ちます。その安定したアプローチにより、プレッシャーにも揺るがず、一貫した結果を出し続けます。',
    stats: {
      speed: 7,
      accuracy: 7,
      consistency: 10
    },
    color: '#10B981' // green
  },
  {
    id: 'brilliant-ben',
    name: '健一',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialty: '概念理解',
    learningStyle: '深い概念学習',
    description: '健一は複雑な概念に対する優れた洞察力を持ち、異なる分野のアイデアを結びつけることが得意です。その深い理解は時に関連する考えの探求へと導きます。',
    stats: {
      speed: 10,
      accuracy: 9.8,
      consistency: 8
    },
    color: '#F59E0B' // amber
  },
  {
    id: 'tactical-tina',
    name: '美咲',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialty: '戦略的学習',
    learningStyle: '重要項目の優先',
    description: '美咲は重要なトピックに戦略的に焦点を当て、学習時間を効率的に配分します。パターンの識別と重要な概念の予測が得意です。',
    stats: {
      speed: 8,
      accuracy: 7,
      consistency: 8
    },
    color: '#FFAAAA' // pink
    }
];